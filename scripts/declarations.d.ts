declare module 'plist';
declare module 'xcode';
declare module 'react-native/local-cli/link/ios/createGroupWithMessage';

declare module 'balanced-match' {
  interface BalancedResult {
    start: number;
    end: number;
    pre: string;
    body: string;
    post: string;
  }

  function balanced(opening: string, closing: string, source: string):BalancedResult;

  namespace balanced {
    function range(opening: string, closing: string, source: string): [number, number];
  }

  export = balanced;
}

declare module 'detect-indent' {
  interface Result {
    amount: number;
    type: string | null;
    indent: string;
  }

  function detectIndent(input: string): Result;

  export = detectIndent;
}

declare module 'detect-newline' {
  function detectNewline(input: string): string | null;

  export = detectNewline;
}
