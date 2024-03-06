import axios from "axios";

const changeLightState = async (
  room: string,
  state: string
): Promise<string> => {
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

export default {
  changeLightState,
};
