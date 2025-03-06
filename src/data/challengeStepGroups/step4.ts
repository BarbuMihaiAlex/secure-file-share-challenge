
import { ChallengeStep } from '@/types/challenge';

export const stepGroup4: ChallengeStep = {
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
};
