const audioVisualizer_fragmentShader = `

out vec4 fragColor;
varying vec2 vUv;

uniform sampler2D tAudioData;

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
   vec3 backgroundColor = vec3( 0.5, 0.125, 0.125 );
   vec3 color = vec3( 1.0, 1.0, 0.0 );

   float f = texture2D( tAudioData, vec2( vUv.x, 0.0 ) ).r;

   float i = step( vUv.y, f ) * step( f - 0.0125, vUv.y );

   fragColor = vec4( mix( backgroundColor, color, i ), 1.0 );
}

void main() {

   mainImage(fragColor, gl_FragCoord.xy);
}
`;
