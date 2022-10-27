const earth_fragmentShader = `

out vec4 fragColor;
varying vec3 v_normal;
varying vec2 v_UV;
varying vec3 v_position;

uniform float time;
uniform sampler2D ground;
uniform sampler2D mask;


void mainImage( out vec4 fragColor, in vec2 fragCoord ) {

    vec3 light = normalize(vec3(1, -0.2, -0.5));
    float ambient = 0.1;
    float diffuse = dot(-light, v_normal);

    vec3 refl = reflect(light, v_normal);

    float mask = texture(mask, v_UV).r;
    //float specular = pow(max(dot(refl, normalize(cameraPosition-v_position)), 0.), 20.) * 0.5 * mask;

    fragColor.xyz = texture(ground, v_UV).rgb;// * (ambient + diffuse);// + specular;
    fragColor.a = 1.0;
}

void main() {
    mainImage(fragColor, gl_FragCoord.xy);
}
`;