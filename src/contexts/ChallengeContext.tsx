
import React, { createContext, useContext, useState, useEffect } from "react";
import { challengeSteps, Step, ChallengeStep } from "@/data/challengeData";
import { toast } from "sonner";

interface ChallengeContextType {
  currentStepGroup: number;
  currentStep: number;
  completedSteps: number[];
  terminalHistory: TerminalEntry[];
  isIntroCompleted: boolean;
  isCompleted: boolean;
  currentOutput: string | null;
  virtualFileSystem: VirtualFileSystem;
  setIsIntroCompleted: (value: boolean) => void;
  executeCommand: (command: string) => void;
  goToNextStep: () => void;
  resetChallenge: () => void;
}

interface TerminalEntry {
  type: "input" | "output" | "error" | "success";
  content: string;
  timestamp: Date;
}

interface VirtualFileSystem {
  [path: string]: {
    type: "file" | "directory";
    content?: string;
    owner?: string;
    group?: string;
    permissions?: string;
  };
}

const initialFileSystem: VirtualFileSystem = {
  "/etc/ssh/sshd_config": {
    type: "file",
    content: `#	$OpenBSD: sshd_config,v 1.103 2018/04/09 20:41:22 tj Exp $

# This is the sshd server system-wide configuration file.  See
# sshd_config(5) for more information.

# This sshd was compiled with PATH=/usr/bin:/bin:/usr/sbin:/sbin

# The strategy used for options in the default sshd_config shipped with
# OpenSSH is to specify options with their default value where
# possible, but leave them commented.  Uncommented options override the
# default value.

#Port 22
#AddressFamily any
#ListenAddress 0.0.0.0
#ListenAddress ::

#HostKey /etc/ssh/ssh_host_rsa_key
#HostKey /etc/ssh/ssh_host_ecdsa_key
#HostKey /etc/ssh/ssh_host_ed25519_key

# Ciphers and keying
#RekeyLimit default none

# Logging
#SyslogFacility AUTH
#LogLevel INFO

# Authentication:

#LoginGraceTime 2m
#PermitRootLogin prohibit-password
#StrictModes yes
#MaxAuthTries 6
#MaxSessions 10

#PubkeyAuthentication yes

# Expect .ssh/authorized_keys2 to be disregarded by default in future.
#AuthorizedKeysFile	.ssh/authorized_keys .ssh/authorized_keys2

#AuthorizedPrincipalsFile none

#AuthorizedKeysCommand none
#AuthorizedKeysCommandUser nobody

# For this to work you will also need host keys in /etc/ssh/ssh_known_hosts
#HostbasedAuthentication no
# Change to yes if you don't trust ~/.ssh/known_hosts for
# HostbasedAuthentication
#IgnoreUserKnownHosts no
# Don't read the user's ~/.rhosts and ~/.shosts files
#IgnoreRhosts yes

# To disable tunneled clear text passwords, change to no here!
#PasswordAuthentication yes
#PermitEmptyPasswords no

# Change to yes to enable challenge-response passwords (beware issues with
# some PAM modules and threads)
ChallengeResponseAuthentication no

# Kerberos options
#KerberosAuthentication no
#KerberosOrLocalPasswd yes
#KerberosTicketCleanup yes
#KerberosGetAFSToken no

# GSSAPI options
#GSSAPIAuthentication no
#GSSAPICleanupCredentials yes
#GSSAPIStrictAcceptorCheck yes
#GSSAPIKeyExchange no

# Set this to 'yes' to enable PAM authentication, account processing,
# and session processing. If this is enabled, PAM authentication will
# be allowed through the ChallengeResponseAuthentication and
# PasswordAuthentication.  Depending on your PAM configuration,
# PAM authentication via ChallengeResponseAuthentication may bypass
# the setting of "PermitRootLogin without-password".
# If you just want the PAM account and session checks to run without
# PAM authentication, then enable this but set PasswordAuthentication
# and ChallengeResponseAuthentication to 'no'.
UsePAM yes

#AllowAgentForwarding yes
#AllowTcpForwarding yes
#GatewayPorts no
X11Forwarding yes
#X11DisplayOffset 10
#X11UseLocalhost yes
#PermitTTY yes
PrintMotd no
#PrintLastLog yes
#TCPKeepAlive yes
#PermitUserEnvironment no
#Compression delayed
#ClientAliveInterval 0
#ClientAliveCountMax 3
#UseDNS no
#PidFile /var/run/sshd.pid
#MaxStartups 10:30:100
#PermitTunnel no
#ChrootDirectory none
#VersionAddendum none

# no default banner path
#Banner none

# Allow client to pass locale environment variables
AcceptEnv LANG LC_*

# override default of no subsystems
Subsystem	sftp	/usr/lib/openssh/sftp-server

# Example of overriding settings on a per-user basis
#Match User anoncvs
#	X11Forwarding no
#	AllowTcpForwarding no
#	PermitTTY no
#	ForceCommand cvs server`,
    owner: "root",
    group: "root",
    permissions: "644"
  },
  "/home": {
    type: "directory",
    owner: "root",
    group: "root",
    permissions: "755"
  }
};

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

export const ChallengeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStepGroup, setCurrentStepGroup] = useState(1);
  const [currentStep, setCurrentStep] = useState(1.1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [terminalHistory, setTerminalHistory] = useState<TerminalEntry[]>([]);
  const [isIntroCompleted, setIsIntroCompleted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentOutput, setCurrentOutput] = useState<string | null>(null);
  const [virtualFileSystem, setVirtualFileSystem] = useState<VirtualFileSystem>(initialFileSystem);

  // Get the current step's data
  const getCurrentStepData = (): Step | undefined => {
    const stepGroup = challengeSteps.find(group => group.id === Math.floor(currentStep));
    if (!stepGroup) return undefined;
    
    return stepGroup.steps.find(step => step.id === currentStep);
  };

  // Execute a command in our virtual terminal
  const executeCommand = (command: string) => {
    // Add the command to terminal history
    const newEntry: TerminalEntry = {
      type: "input",
      content: command,
      timestamp: new Date()
    };
    setTerminalHistory(prev => [...prev, newEntry]);
    
    // Get the current step's data
    const stepData = getCurrentStepData();
    if (!stepData) {
      handleCommandOutput("Error: Step data not found.", "error");
      return;
    }

    // Special handlers for specific commands
    if (command === "CONFIG_ADDED") {
      // Simulating adding SFTP configuration to sshd_config
      const updatedFS = { ...virtualFileSystem };
      if (updatedFS["/etc/ssh/sshd_config"]) {
        const currentContent = updatedFS["/etc/ssh/sshd_config"].content || "";
        updatedFS["/etc/ssh/sshd_config"].content = currentContent + `\n\nSubsystem sftp /usr/lib/openssh/sftp-server\nPermitRootLogin no\nPasswordAuthentication yes`;
        setVirtualFileSystem(updatedFS);
        handleCommandOutput("Configuration added.", "success");
        
        if (command === stepData.command) {
          markStepAsCompleted();
        }
      } else {
        handleCommandOutput("Error: Configuration file not found.", "error");
      }
      return;
    }
    
    if (command === "SFTP_CONFIG_ADDED") {
      // Simulating adding SFTP restrictions to sshd_config
      const updatedFS = { ...virtualFileSystem };
      if (updatedFS["/etc/ssh/sshd_config"]) {
        const currentContent = updatedFS["/etc/ssh/sshd_config"].content || "";
        updatedFS["/etc/ssh/sshd_config"].content = currentContent + `\n\nMatch User sftpuser\nChrootDirectory /home/sftpuser\nForceCommand internal-sftp\nAllowTcpForwarding no`;
        setVirtualFileSystem(updatedFS);
        handleCommandOutput("SFTP restrictions configured.", "success");
        
        if (command === stepData.command) {
          markStepAsCompleted();
        }
      } else {
        handleCommandOutput("Error: Configuration file not found.", "error");
      }
      return;
    }

    // Handle different SSH/SFTP commands
    if (command.startsWith("sudo apt update") || command === "sudo apt update && sudo apt install openssh-server -y") {
      handleCommandOutput("Reading package lists... Done\nBuilding dependency tree... Done\nReading state information... Done\nAll packages are up to date.\nopenssh-server is already installed.", "output");
      if (command === stepData.command) {
        markStepAsCompleted();
      }
      return;
    }
    
    if (command === "sudo nano /etc/ssh/sshd_config") {
      handleCommandOutput("File opened in nano editor.", "output");
      if (command === stepData.command) {
        markStepAsCompleted();
      }
      return;
    }
    
    if (command === "sudo systemctl restart sshd") {
      handleCommandOutput("SSH service restarted.", "success");
      if (command === stepData.command) {
        markStepAsCompleted();
      }
      return;
    }
    
    if (command === "sudo useradd -m sftpuser") {
      // Create user directory in virtual file system
      const updatedFS = { ...virtualFileSystem };
      updatedFS["/home/sftpuser"] = {
        type: "directory",
        owner: "sftpuser",
        group: "sftpuser",
        permissions: "755"
      };
      setVirtualFileSystem(updatedFS);
      
      handleCommandOutput("User 'sftpuser' created.", "success");
      if (command === stepData.command) {
        markStepAsCompleted();
      }
      return;
    }
    
    if (command === "sudo passwd sftpuser") {
      handleCommandOutput("Enter new UNIX password: \nRetype new UNIX password: \npasswd: password updated successfully\nPassword set for 'sftpuser'.", "success");
      if (command === stepData.command) {
        markStepAsCompleted();
      }
      return;
    }
    
    if (command === "sudo mkdir /home/sftpuser/uploads") {
      // Create uploads directory in virtual file system
      const updatedFS = { ...virtualFileSystem };
      if (updatedFS["/home/sftpuser"]) {
        updatedFS["/home/sftpuser/uploads"] = {
          type: "directory",
          owner: "root",
          group: "root",
          permissions: "755"
        };
        setVirtualFileSystem(updatedFS);
        handleCommandOutput("Directory created.", "success");
        
        if (command === stepData.command) {
          markStepAsCompleted();
        }
      } else {
        handleCommandOutput("Error: Parent directory not found.", "error");
      }
      return;
    }
    
    if (command === "sudo chown root:root /home/sftpuser") {
      // Update directory ownership in virtual file system
      const updatedFS = { ...virtualFileSystem };
      if (updatedFS["/home/sftpuser"]) {
        updatedFS["/home/sftpuser"].owner = "root";
        updatedFS["/home/sftpuser"].group = "root";
        setVirtualFileSystem(updatedFS);
        handleCommandOutput("Ownership changed.", "success");
        
        if (command === stepData.command) {
          markStepAsCompleted();
        }
      } else {
        handleCommandOutput("Error: Directory not found.", "error");
      }
      return;
    }
    
    if (command === "sudo chmod 755 /home/sftpuser") {
      // Update directory permissions in virtual file system
      const updatedFS = { ...virtualFileSystem };
      if (updatedFS["/home/sftpuser"]) {
        updatedFS["/home/sftpuser"].permissions = "755";
        setVirtualFileSystem(updatedFS);
        handleCommandOutput("Permissions set.", "success");
        
        if (command === stepData.command) {
          markStepAsCompleted();
        }
      } else {
        handleCommandOutput("Error: Directory not found.", "error");
      }
      return;
    }
    
    if (command === "sudo chown sftpuser:sftpuser /home/sftpuser/uploads") {
      // Update directory ownership in virtual file system
      const updatedFS = { ...virtualFileSystem };
      if (updatedFS["/home/sftpuser/uploads"]) {
        updatedFS["/home/sftpuser/uploads"].owner = "sftpuser";
        updatedFS["/home/sftpuser/uploads"].group = "sftpuser";
        setVirtualFileSystem(updatedFS);
        handleCommandOutput("Ownership changed.", "success");
        
        if (command === stepData.command) {
          markStepAsCompleted();
        }
      } else {
        handleCommandOutput("Error: Directory not found.", "error");
      }
      return;
    }
    
    if (command === "echo 'This is a test file for SFTP upload' > testfile.txt") {
      // Create test file in virtual file system
      const updatedFS = { ...virtualFileSystem };
      updatedFS["testfile.txt"] = {
        type: "file",
        content: "This is a test file for SFTP upload",
        owner: "ubuntu",
        group: "ubuntu",
        permissions: "644"
      };
      setVirtualFileSystem(updatedFS);
      
      handleCommandOutput("Test file created.", "success");
      if (command === stepData.command) {
        markStepAsCompleted();
      }
      return;
    }
    
    if (command === "sftp sftpuser@localhost") {
      handleCommandOutput("sftpuser@localhost's password: \nConnected to localhost.\nsftp> ", "output");
      if (command === stepData.command) {
        markStepAsCompleted();
      }
      return;
    }
    
    if (command === "put testfile.txt") {
      // Simulate uploading file to SFTP server
      const updatedFS = { ...virtualFileSystem };
      if (updatedFS["/home/sftpuser/uploads"]) {
        updatedFS["/home/sftpuser/uploads/testfile.txt"] = {
          type: "file",
          content: "This is a test file for SFTP upload",
          owner: "sftpuser",
          group: "sftpuser",
          permissions: "644"
        };
        setVirtualFileSystem(updatedFS);
        
        handleCommandOutput("Uploading testfile.txt to /uploads/testfile.txt\n100% 35     0.0KB/s   00:00\nFile uploaded successfully.", "success");
        
        if (command === stepData.command) {
          markStepAsCompleted();
        }
      } else {
        handleCommandOutput("Error: Upload directory not found.", "error");
      }
      return;
    }
    
    if (command === "ls" && currentStep === 4.4) {
      handleCommandOutput("testfile.txt", "output");
      if (command === stepData.command) {
        markStepAsCompleted();
      }
      return;
    }
    
    if (command === "exit" && currentStep === 4.5) {
      handleCommandOutput("Connection closed.", "output");
      if (command === stepData.command) {
        markStepAsCompleted();
        
        // Show completion toast with flag
        setTimeout(() => {
          toast.success("Challenge Complete! Flag: FLAG{secure_sftp_configured}", {
            duration: 10000,
          });
          setIsCompleted(true);
        }, 1000);
      }
      return;
    }
    
    // Check if command matches expected command for this step
    if (command === stepData.command) {
      if (stepData.expectedOutput) {
        handleCommandOutput(stepData.expectedOutput, "output");
        markStepAsCompleted();
      } else {
        handleCommandOutput("Command executed successfully.", "success");
        markStepAsCompleted();
      }
    } else {
      // Command doesn't match the expected one
      handleCommandOutput(`Command '${command}' not recognized for this step. Try: ${stepData.command}`, "error");
    }
  };

  // Handle command output
  const handleCommandOutput = (output: string, type: "output" | "error" | "success") => {
    const outputEntry: TerminalEntry = {
      type,
      content: output,
      timestamp: new Date()
    };
    setTerminalHistory(prev => [...prev, outputEntry]);
    setCurrentOutput(output);
  };

  // Mark the current step as completed and move to the next step
  const markStepAsCompleted = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
      
      // Show success toast
      const stepData = getCurrentStepData();
      if (stepData) {
        toast.success(`Step completed: ${stepData.title}`);
      }
      
      // Automatically move to next step after completion
      setTimeout(() => {
        goToNextStep();
      }, 1000);
    }
  };

  // Go to the next step
  const goToNextStep = () => {
    const currentGroupIndex = challengeSteps.findIndex(group => group.id === Math.floor(currentStep));
    
    if (currentGroupIndex === -1) return;
    
    const currentGroup = challengeSteps[currentGroupIndex];
    const stepIndex = currentGroup.steps.findIndex(step => step.id === currentStep);
    
    if (stepIndex === -1) return;
    
    // If there are more steps in this group
    if (stepIndex < currentGroup.steps.length - 1) {
      setCurrentStep(currentGroup.steps[stepIndex + 1].id);
    } 
    // If we need to move to the next group
    else if (currentGroupIndex < challengeSteps.length - 1) {
      setCurrentStepGroup(challengeSteps[currentGroupIndex + 1].id);
      setCurrentStep(challengeSteps[currentGroupIndex + 1].steps[0].id);
    }
    // If this is the last step of the last group, mark challenge as completed
    else if (currentGroupIndex === challengeSteps.length - 1 && 
             stepIndex === currentGroup.steps.length - 1) {
      // Challenge complete
      setIsCompleted(true);
    }
  };

  // Reset the challenge
  const resetChallenge = () => {
    setCurrentStepGroup(1);
    setCurrentStep(1.1);
    setCompletedSteps([]);
    setTerminalHistory([]);
    setIsIntroCompleted(false);
    setIsCompleted(false);
    setCurrentOutput(null);
    setVirtualFileSystem(initialFileSystem);
  };

  return (
    <ChallengeContext.Provider value={{
      currentStepGroup,
      currentStep,
      completedSteps,
      terminalHistory,
      isIntroCompleted,
      isCompleted,
      currentOutput,
      virtualFileSystem,
      setIsIntroCompleted,
      executeCommand,
      goToNextStep,
      resetChallenge
    }}>
      {children}
    </ChallengeContext.Provider>
  );
};

export const useChallenge = () => {
  const context = useContext(ChallengeContext);
  if (context === undefined) {
    throw new Error("useChallenge must be used within a ChallengeProvider");
  }
  return context;
};
