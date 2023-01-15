export const vertexShader = `
    precision mediump float;
    precision mediump int;

    struct Color {
        int animationType;
        vec3 colorStart;
        vec3 colorEnd;
        float speed;
    };
    struct ParticleSystem {
        Color color;
    };
    uniform ParticleSystem particleSystem;
    uniform int timeStart;
    uniform int timeNow;

    varying vec4  vColor;

    void main()	{
        // Time
        float time = float(timeNow) / 1000.0;

        // Position
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

        // Size
        float customSize = 2.0;
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_PointSize = customSize * ( 300.0 / length( mvPosition.xyz ) );

        // Color
        vColor = vec4(1.0,1.0,1.0,1.0);
        if (particleSystem.color.animationType == 1) {
            vColor.rgb = particleSystem.color.colorStart;
        } else if (particleSystem.color.animationType == 2) {
            float speed = particleSystem.color.speed;
            vec3 tmp1 = particleSystem.color.colorStart * abs(cos(time * speed));
            vec3 tmp2 = particleSystem.color.colorEnd * abs(sin(time * speed));
            vColor.rgb = tmp1 + tmp2;
        }
    }
`;

export const fragmentShader = `
    precision mediump float;
    precision mediump int;

    #define M_PI 3.1415926535897932384626433832795

    uniform sampler2D particleTexture;

    varying vec4  vColor;

    void main()	{
        float vAngle = M_PI;
        float c = cos(vAngle);
        float s = sin(vAngle);
        vec2 rotatedUV = vec2(
            c * (gl_PointCoord.x - 0.5) + s * (gl_PointCoord.y - 0.5) + 0.5, 
            c * (gl_PointCoord.y - 0.5) - s * (gl_PointCoord.x - 0.5) + 0.5
        );  // rotate UV coordinates to rotate texture

        gl_FragColor = vColor * texture2D(particleTexture, rotatedUV); // sets an otherwise white particle texture to desired color
        if (gl_FragColor.a < 0.1) {
            gl_FragColor.a  = 0.0;
        }
    }
`;