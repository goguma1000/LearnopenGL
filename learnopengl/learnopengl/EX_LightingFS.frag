#version 330 core
out vec4 FragColor;

in vec3 Normal;
in vec3 FragPos;
in vec3 LightPos; // for view space phong shading

uniform vec3 objectColor;
uniform vec3 lightColor;
uniform vec3 viewPos;

float specularStrength = 0.5f;

void main(){
	//ambient
	float ambientStrength = 0.1f;
	vec3 ambient = ambientStrength * lightColor;
	//diffuse
	vec3 norm = normalize(Normal);
	vec3 lightDir = normalize(LightPos - FragPos);
	float diff = max(dot(norm, lightDir), 0.0);
	vec3 diffuse = diff * lightColor;
	//specular
	vec3 viewDIr = normalize(- FragPos); // the viewer is alwayhs (0.0.0) in view - space
	//	reflect function expects the first vector to point from the light source towards the fragment's position.
	vec3 reflectDir = reflect(-lightDir, norm);
	float spec = pow(max(dot(viewDIr,reflectDir),0.0f),32);
	vec3 specular = specularStrength * spec * lightColor;

	vec3 result = (diffuse + ambient + specular) * objectColor;
	FragColor = vec4(result, 1.0f);
}

//phong lighting model을 vertex shader에서 구현하면
//fragment보다 vertex의 수가 적으므로 (비용이 많이 드는)lighting 계산들이 덜 사용 돼서 효율적
//하지만 vertex shader의 최종 컬러 값은 vertexd의 lighting 컬러이고 fragment는 interpolated lighting color가 됨
//vertex가 많지 않으면 현실적으로 보이지 않음
// vetex에서 구현된 phong lighting model은 phong shading 대신 gouraud shading 이라고 부름.