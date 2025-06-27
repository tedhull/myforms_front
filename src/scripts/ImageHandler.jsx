import axios from "axios";

export async function upload(file) {
    const api = process.env.REACT_APP_API_ADDRESS;
    const presign = await axios.post(`${api}/blob/presign`, {

            filename: file.name,
        },
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        }
    ).catch((error) => {
        console.log(error)
    });
    const {url: uploadUrl, key} = presign.data;

    await axios.put(uploadUrl, file, {
        headers: {
            contentType: file.type,
        }
    }).catch(err => {
        console.log(err)
    });
    return key;
}

export function getImage(key) {
    const result = `https://pub-2eb7621390ec4e9795dd0c10aeffc404.r2.dev/${key}`;
    console.log(result);
    return result;
}
