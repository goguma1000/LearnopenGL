#version 330 core

out vec4 FragColor;

in vec2 TexCoords;

uniform sampler2D screenTexture;
const float offset = 1.0/ 300.0f;

void main(){
	//FragColor =vec4(1.0) - texture(screenTexture, TexCoords);

	//FragColor =texture(screenTexture, TexCoords);
	//float average = 0.2126 * FragColor.r + 0.7152 * FragColor.g + 0.0722 * FragColor.b;
	//FragColor = vec4(average, average, average, 1.0f);

	vec2 offsets[9] = vec2[](
		vec2(-offset,  offset),
		vec2(	0.0f,  offset),
		vec2( offset,  offset),
		vec2(-offset,	 0.0f),
		vec2(	0.0f, 	 0.0f),
		vec2( offset, 	 0.0f),
		vec2(-offset, -offset),
		vec2(	0.0f,  offset),
		vec2(offset,  -offset)
	);

	float sarpKernel[9] = float[](
		-1, -1, -1,
		-1,  9, -1,
		-1, -1, -1
	);

	float blurKernel[9] = float[](
		1.0f / 16.0f, 2.0f / 16.0f, 1.0f / 16.0f,
		2.0f / 16.0f, 4.0f / 16.0f, 2.0f / 16.0f,
		1.0f / 16.0f, 2.0f / 16.0f, 1.0f / 16.0f 
	);

	vec3 sampleTex[9];
	for(int i = 0; i < 9; i++){
		sampleTex[i] = vec3(texture(screenTexture,TexCoords+offsets[i]));
	}
	vec3 col = vec3(0.0f);
	/*for(int i = 0; i < 9; i++)
		col += sampleTex[i] * sarpKernel[i];*/
	for(int i = 0; i < 9; i++)
		col += sampleTex[i] * blurKernel[i];
	FragColor = vec4(col, 1.0f);
}