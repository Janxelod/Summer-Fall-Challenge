const alpaca_vertexShader = `

varying vec3 v_normal;
varying vec2 v_UV;
varying vec3 v_position;

uniform float time;

void main(void) {

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    v_normal = (modelMatrix * vec4(normal, 0.)).xyz;
    v_position = (modelMatrix * vec4(position, 1.)).xyz;
    v_UV = uv;    
}
`;