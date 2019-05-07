
import axios from 'axios'

export default() => {

  let url = process.env.ROOT_API;

  console.log(url + ' <- Api url');

  return axios.create({
    baseURL: url
  })
}