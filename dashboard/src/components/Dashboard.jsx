/*
👥 Equipe Goal Breakers

-   **Áurea Sardinha - 563837**
-   **Eduardo Ulisses - 566339**
-   **Henrique Guedes - 562474**
-   **Laura Tigre - 565281**
-   **Otávio Inaba - 565003**
*/

import { useState, useEffect } from "react";
import SensorChart from "./SensorChart";
import StatusCard from "./StatusCard";

const MAX_DATA_POINTS = 30;

function Dashboard() {
  const [dataHistory, setDataHistory] = useState([]);

  const [currentData, setCurrentData] = useState({
    temperatura: 0,
    umidade: 0,
    luminosidade: 0,
  });

  const [status, setStatus] = useState({ temp: "Ok", humid: "Ok", lum: "Ok" });

  const avaliarStatusCampo = (temp, humidity, luminosity) => {
    setStatus({
      temp: temp > 35 ? "Alta" : "Normal" || temp < 5 ? "Baixa" : "Normal",
      humid: humidity > 80 ? "Alta" : "Normal",
      lum: luminosity > 1000 ? "Alta" : "Normal",
    });
  };

  useEffect(() => {
    const ipAddress = import.meta.env.VITE_API_URL; // IP da sua VM

    const buscarDados = async () => {
      try {
        const url = `http://${ipAddress}:1026/v2/entities/urn:ngsi-ld:device:001`;

        console.log("Tentando fetch (Configuração EXATA do Postman):", url);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "fiware-service": "smart",
            "fiware-servicepath": "/",
          },
        });

        console.log("Status da Resposta:", response.status);

        if (!response.ok) {
          throw new Error(
            `Erro na resposta da API: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Entidade ENCONTRADA:", data);

        const newDataPoint = {
          temperatura: data.temperature ? data.temperature.value : 0,
          umidade: data.humidity.value,
          luminosidade: data.luminosity.value,
          timestamp: new Date().toLocaleTimeString(),
        };

        setCurrentData(newDataPoint);

        setDataHistory((prevHistory) => {
          const newHistory = [...prevHistory, newDataPoint];
          if (newHistory.length > MAX_DATA_POINTS) {
            return newHistory.slice(newHistory.length - MAX_DATA_POINTS);
          }
          return newHistory;
        });

        avaliarStatusCampo(
          newDataPoint.temperatura,
          newDataPoint.umidade,
          newDataPoint.luminosidade
        );
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    const interval = setInterval(buscarDados, 3000);
    buscarDados();

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatusCard
          label="Temperatura"
          value={currentData.temperatura}
          unit="°C"
          status={status.temp}
        />
        <StatusCard
          label="Umidade"
          value={currentData.umidade}
          unit="%"
          status={status.humid}
        />
        <StatusCard
          label="Luminosidade"
          value={currentData.luminosidade}
          unit="lux"
          status={status.lum}
        />
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Histórico dos Sensores</h2>
        <SensorChart data={dataHistory} />
      </div>
    </div>
  );
}

export default Dashboard;
