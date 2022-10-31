const lava_vertex = `uniform sampler2D noiseTexture;
uniform float noiseScale;

uniform sampler2D bumpTexture;
uniform float bumpSpeed;
uniform float bumpScale;

uniform float time;

varying vec2 vUv;

void main() 
{ 
    vUv = uv;
	
	vec2 uvTimeShift = vUv + vec2( 1.1, 1.9 ) * time * bumpSpeed;
	vec4 noiseGeneratorTimeShift = texture2D( noiseTexture, uvTimeShift );
	vec2 uvNoiseTimeShift = vUv + noiseScale * vec2( noiseGeneratorTimeShift.r, noiseGeneratorTimeShift.g );
	vec4 bumpData = texture2D( bumpTexture, uvTimeShift );

	float displacement = ( vUv.y > 0.999 || vUv.y < 0.001 ) ? 
		bumpScale * (0.3 + 0.02 * sin(time)) :  
		bumpScale * bumpData.r;

    vec3 newPosition = position + normal * displacement;
	gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(newPosition,1.0);
}`;

export {lava_vertex};