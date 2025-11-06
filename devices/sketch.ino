#include <WiFi.h>
#include <PubSubClient.h>
#include "DHT.h"
#include <Wire.h>
#include <stdio.h>

/*
👥 Equipe Goal Breakers

-   **Áurea Sardinha - 563837**
-   **Eduardo Ulisses - 566339**
-   **Henrique Guedes - 562474**
-   **Laura Tigre - 565281**
-   **Otávio Inaba - 565003**
*/

#define TOPICO_SUBSCRIBE "/TEF/device001/cmd"
#define TOPICO_PUBLISH   "/TEF/device001/attrs"
#define TOPICO_PUBLISH_1 "/TEF/device001/attrs/s"
#define TOPICO_PUBLISH_2 "/TEF/device001/attrs/l"
#define TOPICO_PUBLISH_3 "/TEF/device001/attrs/h"
#define TOPICO_PUBLISH_4 "/TEF/device001/attrs/t"

#define ID_MQTT "fiware_001"

#define DHTTYPE DHT22
#define DHTPIN 4
#define sensor_ldr 34

const char* SSID = "Wokwi-GUEST";
const char* PASSWORD = "";

const char* BROKER_MQTT = "IP DA SUA VM"; // <- coloque aqui o ip do seu servidor
const int BROKER_PORT = 1883;

int D4 = 2;

String EstadoSaida = "0";

WiFiClient espClient;
PubSubClient MQTT(espClient);
DHT dht(DHTPIN, DHTTYPE);

void initSerial();
void initWiFi();
void initMQTT();
void reconectWiFi();
void mqtt_callback(char* topic, byte* payload, unsigned int length);
void VerificaConexoesWiFIEMQTT(void);
void InitOutput(void);
void EnviaEstadoOutputMQTT(void);
void reconnectMQTT(void);

void setup() {
    InitOutput();
    initSerial();
    initWiFi();
    initMQTT();
    dht.begin();
    MQTT.publish(TOPICO_PUBLISH, "s|off");
}

void initSerial() {
    Serial.begin(115200);
}

void initWiFi() {
    delay(10);
    Serial.println("------Conexao WI-FI------");
    Serial.print("Conectando-se na rede: ");
    Serial.println(SSID);
    Serial.println("Aguarde");
    reconectWiFi();
}

void initMQTT() {
    MQTT.setServer(BROKER_MQTT, BROKER_PORT);
    MQTT.setCallback(mqtt_callback);
}

void mqtt_callback(char* topic, byte* payload, unsigned int length) {
    String msg;
    for (int i = 0; i < length; i++) {
        char c = (char)payload[i];
        msg += c;
    }
    Serial.print("- Mensagem recebida: ");
    Serial.println(msg);

    if(msg.equals("device001@on|")){
      digitalWrite(D4, HIGH);
      EstadoSaida = "1";
    }

    if(msg.equals("device001@off|")){
      digitalWrite(D4, LOW);
      EstadoSaida = "0";
    }
}

void reconnectMQTT() {
    while (!MQTT.connected()) {
        Serial.print("* Tentando se conectar ao Broker MQTT: ");
        Serial.println(BROKER_MQTT);
        if (MQTT.connect(ID_MQTT)) {
            Serial.println("Conectado com sucesso ao broker MQTT!");
            MQTT.subscribe(TOPICO_SUBSCRIBE);
        } else {
            Serial.println("Falha ao reconectar no broker.");
            Serial.println("Haverá nova tentativa de conexão em 2s");
            delay(2000);
        }
    }
}

void reconectWiFi() {
    if (WiFi.status() == WL_CONNECTED)
        return;
    WiFi.begin(SSID, PASSWORD);
    while (WiFi.status() != WL_CONNECTED) {
        delay(100);
        Serial.print(".");
    }
    Serial.println();
    Serial.println("Conectado com sucesso na rede ");
    Serial.print(SSID);
    Serial.println("IP obtido: ");
    Serial.println(WiFi.localIP());

    digitalWrite(D4, LOW);
}

void VerificaConexoesWiFIEMQTT() {
    if (!MQTT.connected())
        reconnectMQTT();
    reconectWiFi();
}

void EnviaEstadoOutputMQTT() {
    if (EstadoSaida == "1") {
        MQTT.publish(TOPICO_PUBLISH_1, "s|on");
        Serial.println("- Led Ligado");
    }

    if (EstadoSaida == "0") {
        MQTT.publish(TOPICO_PUBLISH_1, "s|off");
        Serial.println("- Led Desligado");
    }
    Serial.println("- Estado do LED onboard enviado ao broker!");
    delay(1000);
}

void InitOutput() {
    pinMode(D4, OUTPUT);
    digitalWrite(D4, HIGH);
    boolean toggle = false;

    for (int i = 0; i <= 10; i++) {
        toggle = !toggle;
        digitalWrite(D4, toggle);
        delay(200);
    }

    digitalWrite(D4, LOW);
}


void loop() {

  char msgBuffer[4];

  VerificaConexoesWiFIEMQTT();
  EnviaEstadoOutputMQTT();

  int leitura_sensor_ldr = analogRead(sensor_ldr);
  int luminosity = map(leitura_sensor_ldr, 0, 4095, 0, 100);
  Serial.print("Luminosidade: ");
  Serial.print(luminosity);
  Serial.println("%");

  dtostrf(luminosity, 4, 1, msgBuffer);
  MQTT.publish(TOPICO_PUBLISH_2, msgBuffer);

  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  if(isnan(humidity) || isnan(temperature)){
    Serial.println(F("Falha leitura do sensor DHT-22"));
  }

  Serial.print(F("Umidade: "));
  Serial.print(humidity);
  Serial.print(F("% Temperatura: "));
  Serial.print(temperature);
  Serial.println(F("°C"));

  dtostrf(humidity, 4, 1, msgBuffer);
  MQTT.publish(TOPICO_PUBLISH_3, msgBuffer);

  dtostrf(temperature, 4, 1, msgBuffer);
  MQTT.publish(TOPICO_PUBLISH_4, msgBuffer);

  MQTT.loop();
}