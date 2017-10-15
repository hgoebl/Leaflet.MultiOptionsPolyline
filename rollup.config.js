import typescript from 'rollup-plugin-typescript';

export default {
  input: './src/MultiOptionsPolyline.ts',
  output: {
    file: 'dist/MultiOptionsPolyline.js',
    format: 'iife'
  },
  name: 'MultiOptionsPolyline',
  globals: {
    leaflet: 'L'
  },
  external: [ 'leaflet' ],
  plugins: [
    typescript({
        typescript: require('typescript')
    })
  ]
}