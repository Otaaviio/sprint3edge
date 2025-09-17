# Projeto: Medidor de Velocidade de Chute com ESP32 e Node-RED

## 1. 👥 Equipe Goal Breakers

- Áurea Sardinha - 563837
- Eduardo Ulisses - 566339
- Henrique Guedes - 562474
- Laura Tigre - 565281
- Otávio Inaba - 565003

---

## Vídeo no YouTube:

https://youtu.be/JvzacxyekPY

---

## 2. Descrição do Projeto

O objetivo deste projeto é criar um sistema de **medição de velocidade de um chute** utilizando dispositivos IoT e uma plataforma de gerenciamento baseada em Node-RED.

O projeto envolve:

- Um **ESP32** com sensor de velocidade (ex.: sensor de efeito Hall ou ultrassônico) que captura dados do movimento.
- Um **Node-RED** que recebe os dados via **MQTT/HTTP** e processa para exibição em tempo real.
- Visualização gráfica da velocidade e histórico de medições.

**Escopo do projeto:**

- Captura de dados em tempo real do sensor de velocidade.
- Envio dos dados via MQTT/HTTP POST para Node-RED.
- Processamento, armazenamento temporário e visualização no dashboard do Node-RED.

---

## 3. Arquitetura Proposta

**Diagrama de Arquitetura:**

[Sensor de Velocidade] --> [ESP32] --> (MQTT/HTTP POST) --> [Node-RED Dashboard] --> [Visualização Gráfica]

**Componentes:**

1. **Dispositivo IoT (ESP32)**

   - Captura a velocidade do chute usando sensor.
   - Conecta à rede Wi-Fi.
   - Envia os dados via requisição MQTT POST para o Node-RED.

2. **Backend / Plataforma Node-RED**

   - Recebe os dados do ESP32.
   - Processa e armazena temporariamente os dados.
   - Exibe gráficos e métricas em tempo real no dashboard.

3. **Frontend (Node-RED Dashboard)**
   - Painel de visualização com gráficos de velocidade.
   - Histórico de medições e análise simples.

---

## 4. Recursos Necessários

**Hardware:**

- ESP32 (DevKit ou similar)
- Sensor de velocidade (Hall Sensor, Ultrassônico ou similar)
- Cabos e protoboard
- Fonte de alimentação 5V

**Software / Ferramentas:**

- Arduino IDE ou VSCode com PlatformIO
- Node-RED instalado localmente ou em servidor
- Node-RED Dashboard (`node-red-dashboard`)
- Bibliotecas Arduino: `WiFi.h`, `HTTPClient.h`, `ArduinoJson.h`

**Linguagens e Frameworks:**

- C++ para ESP32
- Node-RED para backend e dashboard (flow visual)
- HTML/CSS/JS básico via dashboard (opcional)

---

## 5. Instruções de Uso

### 5.1 Configuração do ESP32

1. Abra o **Arduino IDE** e configure a placa como **ESP32 Dev Module**.
2. Instale as bibliotecas necessárias:
   - `WiFi.h`
   - `HTTPClient.h`
   - `ArduinoJson.h`
3. Configure rede e servidor no código:

```cpp
const char* ssid = "SEU_SSID";
const char* password = "SUA_SENHA";
const char* serverURL = "http://IP_DO_NODE_RED:1880/velocidade";
```

4. Conecte o sensor ao ESP32 conforme o tipo de sensor.

5. Faça upload do código para o ESP32.

### 5.2 Configuração do Node-RED

1. Instale o Node-RED:

```bash
npm install -g node-red
node-red
```

2. Instale o Node-RED Dashboard:

```bash
cd ~/.node-red
npm install node-red-dashboard
```

3. Crie um flow com os seguintes nós:

- MQTT/HTTP in (rota /velocidade, método POST)

- json (decodifica dados do ESP32)

- function (processa/calcula métricas, se necessário)

- ui_gauge ou ui_chart (visualização)

- MQTT/HTTP response (responde ao ESP32)

4. Acesse o dashboard: http://localhost:1880/ui

5.3 Testando o Sistema

- Ligue o ESP32.

- Abra o dashboard Node-RED.

- Observe a leitura da velocidade em tempo real quando o chute é realizado.

6. Estrutura de Código Fonte

ESP32:

Node-RED:

```pgsql
/Node-RED
└─ flow.json      # Exportação do flow completo do Node-RED
```
