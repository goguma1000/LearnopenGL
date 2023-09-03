#version 330 core

struct Material{
	sampler2D texture_diffuse1;
	sampler2D texture_diffuse2;
	sampler2D texture_diffuse3;
	sampler2D texture_specular1;
	sampler2D texture_specular2;
};

struct DirLight{
	vec3 direction;

	vec3 ambient;
	vec3 diffuse;
	vec3 specular;
};

struct PointLight{
	vec3 position;

	float constant;
	float linear;
	float quadratic;

	vec3 ambient;
	vec3 diffuse;
	vec3 specular;
};

struct SpotLight{
	vec3 position;
	vec3 direction;

	float constant;
	float linear;
	float quadratic;
	float CutOff;
	float outerCutOff;

	vec3 ambient;
	vec3 diffuse;
	vec3 specular;
};

vec3 CalDirLight(DirLight light, vec3 normal, vec3 viewDir);
vec3 CalPointLight(PointLight light, vec3 normal, vec3 viewDir, vec3 fragpos);
vec3 CalSpotLight(SpotLight light, vec3 normal, vec3 viewDir, vec3 fragpos);

out vec4 FragColor;

in vec2 TexCoords;
in vec3 FragPos;
in vec3 Normal;

uniform Material material;
uniform DirLight dirLight;
uniform PointLight pointLights[1];
uniform SpotLight spotLight;
uniform vec3 viewPos;

void main(){
	vec3 norm = normalize(Normal);
	vec3 viewDir = normalize(viewPos - FragPos);

	vec3 result = CalDirLight(dirLight,norm,viewDir);
	for(int i = 0; i < 1; i++){
			result += CalPointLight(pointLights[i],norm,viewDir, FragPos);
	}
	result += CalSpotLight(spotLight, norm, viewDir, FragPos);
	FragColor = vec4(result,1.0f);
}

vec3 CalDirLight(DirLight light, vec3 normal, vec3 viewDir){
	vec3 lightDIr = normalize(-light.direction);
	//diffuse
	float diff = max(dot(lightDIr, normal), 0.0f);
	//specular
	vec3 reflectDir = reflect(-lightDIr, normal);
	float spec = pow(max(dot(reflectDir,viewDir), 0.0f), 32.0f);
	//combine result
	vec3 ambient = light.ambient * vec3(texture(material.texture_diffuse1,TexCoords));
	vec3 diffuse = light.diffuse * diff * vec3(texture(material.texture_diffuse1,TexCoords));
	vec3 specular = light.specular * spec * vec3(texture(material.texture_specular1,TexCoords));
	return ambient + diffuse + specular;
}

vec3 CalPointLight(PointLight light, vec3 normal, vec3 viewDir, vec3 fragpos){
	vec3 lightDIr = normalize(light.position - fragpos);
	//diffuse
	float diff = max(dot(lightDIr, normal), 0.0f);
	//specular
	vec3 reflectDir = reflect(-lightDIr, normal);
	float spec = pow(max(dot(reflectDir, viewDir), 0.0f), 32.0f);
	//attenuation
	float distance = length(lightDIr);
	float attenuation = 1.0 / (light.constant + distance * light.linear + (distance * distance) * light.quadratic);
	//combine result
	vec3 ambient = light.ambient * vec3(texture(material.texture_diffuse1,TexCoords));
	vec3 diffuse = light.diffuse * diff * vec3(texture(material.texture_diffuse1,TexCoords));
	vec3 specular = light.specular * spec * vec3(texture(material.texture_specular1,TexCoords));
	return (ambient + diffuse + specular)*attenuation;
}

vec3 CalSpotLight(SpotLight light, vec3 normal, vec3 viewDir, vec3 fragpos){
	vec3 lightDir = normalize(light.position - fragpos);
	//diffuse
	float diff = max(dot(lightDir, normal), 0.0f);
	//specular
	vec3 reflectDir = reflect(-lightDir, normal);
	float spec = pow(max(dot(reflectDir, viewDir), 0.0f), 32.0f);
	//attenuation
	float distance = length(lightDir);
	float attenuation = 1.0 / (light.constant + distance * light.linear + (distance * distance) * light.quadratic);
	//spot light intensity
	float theta = dot(lightDir, normalize(-light.direction));
	float epsilon = light.CutOff - light.outerCutOff;
	float intensity = clamp((theta - light.outerCutOff) / epsilon, 0.0, 1.0);
	//combine
	vec3 ambient = light.ambient * vec3(texture(material.texture_diffuse1,TexCoords));
	vec3 diffuse = light.diffuse * diff * vec3(texture(material.texture_diffuse1,TexCoords));
	vec3 specular = light.specular * spec * vec3(texture(material.texture_specular1,TexCoords));
	return (ambient + diffuse + specular)*attenuation * intensity;
}
