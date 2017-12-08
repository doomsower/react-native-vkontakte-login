declare module 'plist';
declare module 'react-native/local-cli/link/ios/createGroupWithMessage';

declare module 'balanced-match' {
  interface BalancedResult {
    start: number;
    end: number;
    pre: string;
    body: string;
    post: string;
  }

  function balanced(opening: string, closing: string, source: string): BalancedResult;

  namespace balanced {
    function range(opening: string, closing: string, source: string): [number, number];
  }

  export = balanced;
}
