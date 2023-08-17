#version 330 core

out vec4 FragColor;

in vec3 ourColor;
in vec2 TexCoord;

uniform sampler2D Texture1;
uniform sampler2D Texture2;
void main()
{
	// 0.0 : first, 1.0 : second, 0.2 : first 80, second 20
	FragColor = mix(texture(Texture1, TexCoord), texture(Texture2, TexCoord), 0.2);
}