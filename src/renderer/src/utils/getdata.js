import { socketurl } from './socket';
import  { IndexedDBManager, databases, DBObserver } from './indexedDB';
import TypeofData from './typeof';
const observeruserPoints = new DBObserver();

const userPointsDBManager = new IndexedDBManager(databases.userPoints,observeruserPoints);

function getformdatabyid(form,split='_') {
  const formData = {};
  const elements = form.elements;

  for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element.type !== 'submit' && element.type !== 'button') {
          const nameParts = element.id.split(split);
          if (nameParts.length > 1 && nameParts[1] === 'check') {
              const baseName = nameParts[0];
              formData[baseName] = formData[baseName] || {};
              formData[baseName]['check'] = element.checked;
          } else {
              if (element.type === 'checkbox') {
                  formData[element.id] = element.checked;
              } else {
                  if (formData[element.id] && typeof formData[element.id] === 'object') {
                      formData[element.id]['value'] = element.value;
                  } else {
                      formData[element.id] = element.value;
                  }
              }
          }
      }
  }

  return formData;
}
async function postToFileHandler(event, params, serverurl) {
  const data = { event, ...params };
  const defaultServerUrl = serverurl || `${socketurl.getport()}/file-handler`;
  const response = await getdatafromserver(defaultServerUrl, data);
  return response;
}
async function getdatafromserver(serverurl,data) {
  const response = await fetch(`${serverurl}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (response) {
    return response.json();
  } else {
    return { success: false, error: 'No response from server' };
  }
}
class getdataIndexdb {
  constructor() {
    this.dbManager = null;
  }

  // Método para obtener todos los datos de la base de datos y almacenarlos en la clase
  async getAllDataFromDB(dbManager) {
        const dbManagerdata = await getAllData(dbManager);
        console.log("dbManagerdata", dbManagerdata);
        this.dbManager = dbManager;
        return dbManagerdata;
  }

  // Método para buscar datos en base al 'id' o 'name' y devolver una propiedad específica
  async getdataIndexdb(data, property = null) {
    const dbManagerdata = await getAllDataFromDB(userPointsDBManager);
    if (!dbManagerdata || dbManagerdata.length === 0) {
      console.log("No data loaded. Please call getAllDataFromDB first.");
      return null;
    }
    const foundItem = dbManagerdata.find(
      item => item.uniqueId === data.uniqueId || item.name === data.name
    );

    if (foundItem) {
      console.log("foundItem", foundItem, property, foundItem[property]);
      return property ? foundItem[property] : foundItem;
    } else {
      console.log("No se encontró un item con el id o name proporcionado.");
      return null;
    }
  }
}
const getdataIndexdbsystempoints = new getdataIndexdb();
async function modifyPoints(id, pointsDelta, data) {
  try {
    // Obtener el registro actual por su ID
    const userData = await userPointsDBManager.getDataById(id);

    if (userData && userData.points) {
      // Actualizar el campo 'points' sumando o restando el valor
      userData.points = (userData.points || 0) + pointsDelta;

      // Guardar el registro actualizado en la base de datos
      await userPointsDBManager.updateData(userData);

      console.log(`Los puntos han sido actualizados correctamente. Nuevo valor: ${userData.points}`);
      return true;
    } else {
      if (data) {
      createdaUserpoints(data, pointsDelta)
      }
      return null;
    }
  } catch (error) {
    console.error("Error al modificar los puntos:", error);
  }
}
async function createdaUserpoints(data, points) {
  let userpoints;
  if (data && data.uniqueId) {
      userpoints = {
        uniqueId: data.uniqueId,
        nickname: data.nickname,
        uniqueId: data.uniqueId,
        name: data.uniqueId,
        points: TypeofData.toNumber(await getdataIndexdbsystempoints.getdataIndexdb(data, 'points')) + points || 0,
        imageUrl: data.profilePictureUrl,
        userId: TypeofData.toNumber(data.userId),
        id: TypeofData.toNumber(data.userId),
    }
    userPointsDBManager.saveOrUpdateDataByName(userpoints);
  }
}
// setInterval(async () => {
//   const numberdatatest = "6554659423998263000"
//   modifyPoints(Number(numberdatatest), +100);
// }, 1000);
async function getAllDataFromDB(dbManager) {
  try {
      const dbManagerdata = await dbManager.getAllData();
      console.log(dbManagerdata);
      return dbManagerdata;
  } catch (e) {
      console.error("Error getting documents: ", e);
  }
}
// observeruserPoints.subscribe(async (action, data) => {
//   if (action === "save") {
//   const dataupdate = await getAllDataFromDB(userPointsDBManager);
//   table.updateRows(dataupdate);
//   } else if (action === "delete") {
//   const dataupdate = await getAllDataFromDB(userPointsDBManager);
//   table.updateRows(dataupdate);
//   } else if (action === "update") {
//   const dataupdate = await getAllDataFromDB(userPointsDBManager);
//   table.updateRows(dataupdate);
//   }
// });
export { getformdatabyid, postToFileHandler, getdatafromserver, getAllDataFromDB, getdataIndexdb, modifyPoints };
