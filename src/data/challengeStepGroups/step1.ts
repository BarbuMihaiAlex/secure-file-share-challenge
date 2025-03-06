
import { ChallengeStep } from '@/types/challenge';

export const stepGroup1: ChallengeStep = {
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
};
