
export interface TermuxPackage {
  id: string;
  name: string;
  category: 'System' | 'Development' | 'Network' | 'Editor' | 'Utility' | 'Security' | 'Multimedia' | 'Python Library';
  description: string;
  installCommand: string;
  source: 'pkg' | 'pip';
  isPopular?: boolean;
}

// Added GeneratedSetup interface to match the schema used in geminiService.ts
export interface GeneratedSetup {
  packageName: string;
  description: string;
  prerequisites: string[];
  installCommands: string[];
  postInstall: string[];
  usage: string;
}
