#version 330 core
layout (location = 0) in vec3 aPos;
layout (location = 1) in vec3 aNormal;

out vec3 Normal;
//vertex position in world space
out vec3 FragPos;
out vec3 LightPos;
out vec4 aColor;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;
uniform vec3 lightPos;
uniform vec3 objectColor;
uniform vec3 lightColor;
uniform vec3 viewPos;

float specularStrength = 0.5f;
float ambientStrength = 0.1f;
void main(){
	FragPos = vec3(model * vec4(aPos,1.0f));
	LightPos = vec3(vec4(lightPos,1.0f));
	Normal = mat3(transpose(inverse(model))) * aNormal; // normal matrix
	//ambient
	vec3 ambient = lightColor * ambientStrength;
	//diffuse
	vec3 lightDir =  normalize(LightPos - FragPos);
	vec3 norm = normalize(Normal);
	float diff = max(dot(lightDir,norm),0.0f);
	vec3 diffuse = diff * lightColor;
	//specular
	vec3 reflectDir = reflect(normalize(FragPos - LightPos),norm);
	vec3 viewDir = normalize(viewPos- FragPos);
	float spec = pow(max(dot(reflectDir,viewDir), 0.0f), 32);
	vec3 specular = specularStrength * spec * lightColor;
	//lighting
	vec3 result = (ambient + diffuse + specular) * objectColor;
	aColor = vec4(result, 1.0f);
	
	gl_Position = projection * view * model * vec4(FragPos, 1.0f);
	
}
