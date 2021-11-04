import axios from 'axios'

// const BASE_URL = 'https://europe-west3-kedrbots-5fee0.cloudfunctions.net/';
// https://europe-west3-kedrbots-5fee0.cloudfunctions.net/rusNovExportAnswers
const TEMP_BASE_URL =
  'https://api.allorigins.win/raw?url=https://europe-west3-kedrbots-5fee0.cloudfunctions.net/'

export default axios.create({
  baseURL: TEMP_BASE_URL,
})
