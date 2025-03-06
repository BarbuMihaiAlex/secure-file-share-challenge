
export type Step = {
  id: number;
  title: string;
  description: string;
  command: string;
  expectedOutput?: string;
  validationRegex?: RegExp;
  hint: string;
  explanation: string;
  infoPanel: {
    title: string;
    content: string;
  };
};

export type ChallengeStep = {
  id: number;
  title: string;
  description: string;
  steps: Step[];
};

export const challengeSteps: ChallengeStep[] = [
  {
    id: 1,
    title: "Install and Configure OpenSSH Server",
    description: "The first step is to install and configure the OpenSSH server, which will provide the foundation for SFTP services.",
    steps: [
      {
        id: 1.1,
        title: "Update package lists and install OpenSSH",
        description: "Update the package lists and install the OpenSSH server package.",
        command: "sudo apt update && sudo apt install openssh-server -y",
        expectedOutput: "openssh-server is already installed.",
        validationRegex: /openssh-server is already installed/,
        hint: "Use 'sudo apt update' to update package lists and 'sudo apt install openssh-server' to install OpenSSH.",
        explanation: "This command updates the package lists on your Ubuntu system and installs the OpenSSH server package, which includes the SFTP subsystem.",
        infoPanel: {
          title: "Why OpenSSH?",
          content: "OpenSSH is the most widely-used SSH implementation. It provides secure encrypted communications between two untrusted hosts over an insecure network. SFTP is a subsystem of SSH that provides file transfer capabilities with the same security benefits as SSH."
        }
      },
      {
        id: 1.2,
        title: "Configure SSH server for SFTP",
        description: "Edit the SSH configuration file to enable SFTP subsystem and set basic security parameters.",
        command: "sudo nano /etc/ssh/sshd_config",
        expectedOutput: "File opened in nano editor.",
        validationRegex: /File opened in nano editor/,
        hint: "You need to edit the SSH server configuration file using a text editor.",
        explanation: "We're using 'nano' to edit the SSH daemon configuration file where we'll enable the SFTP subsystem and configure security settings.",
        infoPanel: {
          title: "SSH Configuration",
          content: "The sshd_config file controls the configuration of the SSH daemon. Proper configuration is crucial for security. We'll be making several important changes to enhance security while enabling SFTP functionality."
        }
      },
      {
        id: 1.3,
        title: "Add SFTP configuration",
        description: "Add or modify the following lines in the sshd_config file:\n```\nSubsystem sftp /usr/lib/openssh/sftp-server\nPermitRootLogin no\nPasswordAuthentication yes\n```",
        command: "CONFIG_ADDED",
        expectedOutput: "Configuration added.",
        validationRegex: /Configuration added/,
        hint: "Find these lines in the file and modify them, or add them at the end if they don't exist.",
        explanation: "These configuration lines enable the SFTP subsystem, disable root login for security, and enable password authentication for SFTP users.",
        infoPanel: {
          title: "Security Best Practices",
          content: "Disabling root login is a security best practice as it prevents direct attacks on the most privileged account. Enabling password authentication is necessary for our SFTP setup, but in production environments, key-based authentication is often preferred for additional security."
        }
      },
      {
        id: 1.4,
        title: "Restart SSH service",
        description: "Apply the configuration changes by restarting the SSH service.",
        command: "sudo systemctl restart sshd",
        expectedOutput: "SSH service restarted.",
        validationRegex: /SSH service restarted/,
        hint: "Use systemctl to restart the SSH daemon after configuration changes.",
        explanation: "After modifying the configuration, we need to restart the SSH service for the changes to take effect.",
        infoPanel: {
          title: "Service Management",
          content: "In modern Ubuntu systems, systemctl is used to control system services. Restarting a service applies any configuration changes without requiring a system reboot. Always verify service status after restarts with 'systemctl status sshd'."
        }
      }
    ]
  },
  {
    id: 2,
    title: "Create SFTP User and Directory Structure",
    description: "Now we'll create a dedicated user for SFTP connections and set up the appropriate directory structure with proper permissions.",
    steps: [
      {
        id: 2.1,
        title: "Create SFTP user",
        description: "Create a new user specifically for SFTP access.",
        command: "sudo useradd -m sftpuser",
        expectedOutput: "User 'sftpuser' created.",
        validationRegex: /User 'sftpuser' created/,
        hint: "Use the useradd command with the -m flag to create a user with a home directory.",
        explanation: "This command creates a new user called 'sftpuser' with a home directory. The -m flag ensures that a home directory is created.",
        infoPanel: {
          title: "Dedicated Users",
          content: "Creating dedicated users for specific services is a security best practice. It follows the principle of least privilege by ensuring that each service has only the permissions it needs, limiting the potential damage if the account is compromised."
        }
      },
      {
        id: 2.2,
        title: "Set password for SFTP user",
        description: "Set a secure password for the new SFTP user.",
        command: "sudo passwd sftpuser",
        expectedOutput: "Password set for 'sftpuser'.",
        validationRegex: /Password set for 'sftpuser'/,
        hint: "Use the passwd command to set the password for the sftpuser account.",
        explanation: "This command sets a password for the 'sftpuser' account. In a production environment, you should use a strong, unique password.",
        infoPanel: {
          title: "Password Security",
          content: "Strong passwords are essential for system security. A strong password should be at least 12 characters long and include a mix of uppercase and lowercase letters, numbers, and special characters. For production systems, consider using key-based authentication instead of passwords for even better security."
        }
      },
      {
        id: 2.3,
        title: "Create uploads directory",
        description: "Create a directory where SFTP users can upload files.",
        command: "sudo mkdir /home/sftpuser/uploads",
        expectedOutput: "Directory created.",
        validationRegex: /Directory created/,
        hint: "Use the mkdir command to create the uploads directory in the sftpuser's home directory.",
        explanation: "This command creates a directory called 'uploads' in the sftpuser's home directory. This will be the directory where files can be uploaded via SFTP.",
        infoPanel: {
          title: "Directory Structure",
          content: "For SFTP with chroot jail (which restricts users to their home directory), it's important to have a proper directory structure. The root of the chroot jail must be owned by root for security, while subdirectories that need write access should be owned by the SFTP user."
        }
      },
      {
        id: 2.4,
        title: "Set root ownership for home directory",
        description: "Set the ownership of the SFTP user's home directory to root for security.",
        command: "sudo chown root:root /home/sftpuser",
        expectedOutput: "Ownership changed.",
        validationRegex: /Ownership changed/,
        hint: "Use the chown command to change the ownership of the directory to root.",
        explanation: "This command changes the ownership of the sftpuser's home directory to the root user. This is necessary for the chroot jail to work securely.",
        infoPanel: {
          title: "Root Ownership Requirement",
          content: "When using ChrootDirectory with SFTP, OpenSSH requires that the chroot directory and all parent directories be owned by root and not writable by any other user or group. This prevents users from modifying the directory structure to escape the chroot jail."
        }
      },
      {
        id: 2.5,
        title: "Set directory permissions",
        description: "Set appropriate permissions for the home directory.",
        command: "sudo chmod 755 /home/sftpuser",
        expectedOutput: "Permissions set.",
        validationRegex: /Permissions set/,
        hint: "Use the chmod command to set the permissions to 755.",
        explanation: "This command sets the permissions of the sftpuser's home directory to 755, which means the owner (root) has read, write, and execute permissions, while group members and others have read and execute permissions.",
        infoPanel: {
          title: "Understanding Permissions",
          content: "Unix permissions are represented by three digits: the first for the owner, the second for the group, and the third for others. Each digit is the sum of: 4 (read), 2 (write), and 1 (execute). So 755 means owner has full access (7=4+2+1), while group and others can only read and execute (5=4+1)."
        }
      },
      {
        id: 2.6,
        title: "Set uploads directory ownership",
        description: "Set the ownership of the uploads directory to the SFTP user.",
        command: "sudo chown sftpuser:sftpuser /home/sftpuser/uploads",
        expectedOutput: "Ownership changed.",
        validationRegex: /Ownership changed/,
        hint: "Use chown to give ownership of the uploads directory to the sftpuser.",
        explanation: "This command changes the ownership of the uploads directory to the sftpuser. This allows the SFTP user to write to this directory, while still being confined to the chroot jail.",
        infoPanel: {
          title: "Granular Permissions",
          content: "By carefully setting ownership and permissions, we create a secure environment where the user can only write to specific directories. This follows the principle of least privilege, giving users only the access they need to perform their tasks."
        }
      }
    ]
  },
  {
    id: 3,
    title: "Restrict SFTP User to SFTP Directory",
    description: "Configure SSH to restrict the SFTP user to their directory using a chroot jail.",
    steps: [
      {
        id: 3.1,
        title: "Edit SSH configuration for SFTP restriction",
        description: "Edit the SSH configuration file again to add SFTP user restrictions.",
        command: "sudo nano /etc/ssh/sshd_config",
        expectedOutput: "File opened in nano editor.",
        validationRegex: /File opened in nano editor/,
        hint: "Use nano to edit the SSH configuration file.",
        explanation: "We're editing the SSH configuration file again to add specific restrictions for our SFTP user.",
        infoPanel: {
          title: "Chroot Jail",
          content: "A chroot jail restricts users to a specific directory, preventing them from accessing files outside that directory. This is an important security measure for SFTP servers, as it limits the damage that could be done if an account is compromised."
        }
      },
      {
        id: 3.2,
        title: "Add SFTP user restrictions",
        description: "Add the following configuration at the end of the file:\n```\nMatch User sftpuser\nChrootDirectory /home/sftpuser\nForceCommand internal-sftp\nAllowTcpForwarding no\n```",
        command: "SFTP_CONFIG_ADDED",
        expectedOutput: "SFTP restrictions configured.",
        validationRegex: /SFTP restrictions configured/,
        hint: "Add these lines at the end of the sshd_config file to restrict the SFTP user.",
        explanation: "This configuration restricts the sftpuser to their home directory using a chroot jail, forces the use of the internal SFTP server, and disables TCP forwarding for security.",
        infoPanel: {
          title: "Configuration Explained",
          content: "- Match User: Applies the following settings only to the specified user\n- ChrootDirectory: Restricts the user to this directory\n- ForceCommand: Forces the use of the internal SFTP subsystem\n- AllowTcpForwarding: Disables TCP port forwarding for this user, preventing potential security bypasses"
        }
      },
      {
        id: 3.3,
        title: "Restart SSH service",
        description: "Apply the new SFTP restrictions by restarting the SSH service.",
        command: "sudo systemctl restart sshd",
        expectedOutput: "SSH service restarted.",
        validationRegex: /SSH service restarted/,
        hint: "Use systemctl to restart the SSH service.",
        explanation: "We're restarting the SSH service to apply our new configuration changes for the SFTP user restrictions.",
        infoPanel: {
          title: "Verify Configuration",
          content: "After restarting services, it's always a good practice to verify that they're running correctly. You can use 'systemctl status sshd' to check the status of the SSH service and look for any error messages in the logs."
        }
      }
    ]
  },
  {
    id: 4,
    title: "Test SFTP Connection and File Transfer",
    description: "Verify that the SFTP server is configured correctly by connecting and transferring a test file.",
    steps: [
      {
        id: 4.1,
        title: "Create a test file",
        description: "Create a test file that we'll upload via SFTP.",
        command: "echo 'This is a test file for SFTP upload' > testfile.txt",
        expectedOutput: "Test file created.",
        validationRegex: /Test file created/,
        hint: "Use the echo command to create a simple text file.",
        explanation: "This command creates a simple text file with a test message that we'll use to verify our SFTP upload functionality.",
        infoPanel: {
          title: "Testing is Crucial",
          content: "Always test your configurations to ensure they work as expected. For file transfer systems, this means verifying that files can be uploaded and downloaded correctly, and that permissions are set appropriately."
        }
      },
      {
        id: 4.2,
        title: "Connect to SFTP server",
        description: "Connect to the SFTP server as the sftpuser.",
        command: "sftp sftpuser@localhost",
        expectedOutput: "Connected to SFTP server.",
        validationRegex: /Connected to SFTP server/,
        hint: "Use the sftp command to connect to the local SFTP server.",
        explanation: "This command connects to the SFTP server running on the local machine using the sftpuser account we created. In a real environment, you would use the actual IP address or hostname of the server.",
        infoPanel: {
          title: "SFTP Client",
          content: "SFTP clients can be command-line tools like the sftp command we're using, or graphical applications like FileZilla. They all use the same underlying protocol to securely transfer files over an SSH connection."
        }
      },
      {
        id: 4.3,
        title: "Upload test file",
        description: "Upload the test file to the SFTP server.",
        command: "put testfile.txt",
        expectedOutput: "File uploaded successfully.",
        validationRegex: /File uploaded successfully/,
        hint: "Use the put command in the SFTP client to upload the file.",
        explanation: "This command uploads the testfile.txt to the SFTP server. Since we're in a chroot jail, the file will be placed in the uploads directory of the sftpuser.",
        infoPanel: {
          title: "SFTP Commands",
          content: "Common SFTP commands include:\n- put: Upload files\n- get: Download files\n- ls: List directory contents\n- cd: Change directory\n- mkdir: Create a directory\n- rm: Remove a file\n- exit: Close the connection"
        }
      },
      {
        id: 4.4,
        title: "Verify file upload",
        description: "Verify that the file was uploaded correctly.",
        command: "ls",
        expectedOutput: "testfile.txt",
        validationRegex: /testfile\.txt/,
        hint: "Use the ls command to list the files in the current directory.",
        explanation: "This command lists the files in the current directory on the SFTP server, which should include our uploaded test file.",
        infoPanel: {
          title: "Verification Process",
          content: "Always verify that your file transfers completed successfully. This can be done by checking file listings, comparing file sizes, or using checksums to ensure file integrity. In professional environments, automated verification processes are often implemented."
        }
      },
      {
        id: 4.5,
        title: "Exit SFTP client",
        description: "Exit the SFTP client.",
        command: "exit",
        expectedOutput: "Connection closed.",
        validationRegex: /Connection closed/,
        hint: "Type 'exit' to close the SFTP connection.",
        explanation: "This command closes the SFTP connection and returns you to the shell.",
        infoPanel: {
          title: "Challenge Complete!",
          content: "Congratulations! You have successfully configured an SFTP server with secure file sharing capabilities. Your setup ensures that the sftpuser can only access their designated directory and can only perform SFTP operations. This type of configuration is commonly used in enterprise environments for secure file transfers."
        }
      }
    ]
  }
];

export const introContent = {
  title: "Secure File Sharing Challenge",
  subtitle: "Configure an SFTP Server on Ubuntu",
  description: `
    Welcome to the Secure File Sharing Challenge! In this cybersecurity exercise, you'll learn how to configure an SFTP server on Ubuntu for secure file transfers.
    
    SFTP (SSH File Transfer Protocol) is a secure alternative to traditional FTP, providing encrypted file transfers over an SSH connection. Unlike FTP, which sends data in plaintext, SFTP encrypts both authentication information and data transfers, making it much more secure for sensitive information.
    
    Key benefits of SFTP include:
    • Strong encryption for all transmitted data
    • Public key authentication options
    • File system permissions and restrictions
    • Ability to resume interrupted transfers
    • Cross-platform support
    
    In this challenge, you'll complete a series of tasks to:
    1. Install and configure an OpenSSH server
    2. Create a dedicated SFTP user with restricted access
    3. Configure a secure directory structure
    4. Test the SFTP connection and file transfers
    
    Let's get started with building a secure file sharing solution!
  `,
  flagDescription: "Complete all steps to earn the flag: FLAG{secure_sftp_configured}",
};
