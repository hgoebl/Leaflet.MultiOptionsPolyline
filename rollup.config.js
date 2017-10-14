import typescript from 'rollup-plugin-typescript';

export default {
  entry: './src/Leaflet.MultiOptionsPolyline.ts',
  output: {
    file: 'dist/Leaflet.MultiOptionsPolyline.js',
    format: 'iife',
    name: 'L.MultiOptionsPolyline',
  },
  plugins: [
    typescript({
        typescript: require('typescript')
      })
  ]
}