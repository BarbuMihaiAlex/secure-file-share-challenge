
import { IntroContent } from '@/types/challenge';

export const introContent: IntroContent = {
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
  // Removed the flagDescription field to hide the flag until completion
};
