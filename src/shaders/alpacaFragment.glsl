const alpaca_fragmentShader = `
out vec4 fragColor;
varying vec2 v_UV;
varying float noise;

uniform sampler2D alpacaTexture;

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
 fragColor.xyz = texture(alpacaTexture, v_UV* ( 1. - 2. * noise )).rgb;
 fragColor.a = 1.0;
}

void main() {
   mainImage(fragColor, gl_FragCoord.xy);
}
`;

export {alpaca_fragmentShader}