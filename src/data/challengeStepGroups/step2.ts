
import { ChallengeStep } from '@/types/challenge';

export const stepGroup2: ChallengeStep = {
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
};
