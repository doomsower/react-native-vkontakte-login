import shebang from 'rollup-plugin-add-shebang';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'builtin-modules';

export default {
  input: './bin/modules/postlink.js',
  output: {
    file: './bin/postlink.js',
    format: 'cjs',
  },
  external: [...builtins, 'balanced-match', 'glob', 'inquirer', 'plist'],
  plugins: [
    resolve(),
    commonjs(),
    shebang({
      include: 'bin/postlink.js',
    }),
  ],
};
