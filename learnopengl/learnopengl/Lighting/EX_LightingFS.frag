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

//phong lighting model�� vertex shader���� �����ϸ�
//fragment���� vertex�� ���� �����Ƿ� (����� ���� ���)lighting ������ �� ��� �ż� ȿ����
//������ vertex shader�� ���� �÷� ���� vertexd�� lighting �÷��̰� fragment�� interpolated lighting color�� ��
//vertex�� ���� ������ ���������� ������ ����
// vetex���� ������ phong lighting model�� phong shading ��� gouraud shading �̶�� �θ�.