
import { ChallengeStep } from '@/types/challenge';

export const stepGroup3: ChallengeStep = {
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
};
