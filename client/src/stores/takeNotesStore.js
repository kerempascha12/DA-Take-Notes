const baseURL = 'http://localhost:3000';

export const usePdfStore = defineStore('pdf', () => {
  const state = reactive({
    allPDFs: [],
    lastPDF: [],
    PDFNotizen: [],
    selectedPDF: {},
  });

  const fetchPDFs = async () => {
    // const { data } = await axios.get('http://localhost:3000/uploads');
    const { data } = await axios.get(`${baseURL}/uploads`);
    state.allPDFs = data;
  };

  const selectPDF = async (id) => {
    state.PDFNotizen = [];
    const { data } = await axios.get(`${baseURL}/database/pdfID/${id}`);
    state.selectedPDF = data[0];
    const { data: notes } = await axios.get(`${baseURL}/database/PDFnotiz/${id}`);
    state.PDFNotizen = notes;
  };

  const postPDF = async (formdata, config, tempPDF) => {
    await axios.post(`${baseURL}/uploads`, formdata, config);
    const { data: datei } = await axios.post(`${baseURL}/database/addPDF`, tempPDF);
    console.log('Sending tempPDF to DB:', tempPDF);
    fetchPDFs();
  };

  const deletePDF = async (name) => {
    await axios.delete(`${baseURL}/uploads/${name}`);
    await axios.delete(`${baseURL}/database/pdf/${name}`);
    fetchPDFs();
  };

  const getPDFnotizen = async (pdfID) => {
    const { data } = await axios.get(`${baseURL}/database/PDFnotiz/${pdfID}`);
    state.PDFNotizen = data;
  };

  const addNotiz = async (title, content, pdfID) => {
    try {
      await axios.post(`${baseURL}/database/PDFnotiz`, {
        title: title,
        content: content,
        userID: 1,
        pdfID: pdfID,
      });
      getPDFnotizen(pdfID);
    } catch (error) {
      console.log(error);
    }
  };

  const delNote = async (noteid, pdfID) => {
    await axios.delete(`${baseURL}/database/note/${noteid}`);
    selectPDF(pdfID);
  };

  const patchNote = async (title, content, noteid, pdfID) => {
    console.log('patchNote called with:', title, content, noteid); // Debug log
    await axios.patch(`${baseURL}/database/note/${noteid}`, {
      title,
      content,
    });
    getPDFnotizen(pdfID);
  };

  return {
    state,
    postPDF,
    fetchPDFs,
    deletePDF,
    getPDFnotizen,
    addNotiz,
    delNote,
    patchNote,
    selectPDF,
  };
});

export const usePPTStore = defineStore('ppt', () => {
  const state = reactive({
    allePräsentationen: [],
  });

  const insertPPT = async (src, width, height) => {
    await axios.post(`${baseURL}/database/pptDatei`, { src: src, width: width, height: height });
    console.log('posted.');
  };

  return {
    state,
    insertPPT,
  };
});
