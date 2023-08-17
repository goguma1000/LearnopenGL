#version 330 core
layout (location = 0) in vec3 aPos;
layout (location = 1) in vec3 aNormal;

out vec3 Normal;
//vertex position in world space
out vec3 FragPos;
out vec3 LightPos;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;
uniform vec3 lightPos;


void main(){
	FragPos = vec3(view * model * vec4(aPos,1.0f));
	LightPos = vec3(view * vec4(lightPos,1.0f));
	Normal = aNormal;
	gl_Position = projection * view * model * vec4(FragPos, 1.0f);
	
}
