import axios from "axios";

interface ChangeLightState {
  room: string;
  state: string;
}

const changeLightState = async ({
  room,
  state,
}: ChangeLightState): Promise<string> => {
  const url = `${process.env.HOMEASSISTANT_URL}services/light/turn_${state}`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.HOMEASSISTANT_TOKEN}`,
  };
  const body = {
    entity_id: `light.${room}`,
  };

  return await axios.post(url, body, { headers }).then((response) => {
    if (response.status === 200) {
      return "Success";
    } else {
      return "Failure";
    }
  });
};

const getWeather = async (): Promise<string> => {
  const url = `${process.env.HOMEASSISTANT_URL}states/weather.home`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.HOMEASSISTANT_TOKEN}`,
  };

  return await axios.get(url, { headers }).then((response) => {
    if (response.status === 200) {
      return response.data.state;
    } else {
      return "Failure";
    }
  });
};

export default {
  changeLightState,
  getWeather,
};
