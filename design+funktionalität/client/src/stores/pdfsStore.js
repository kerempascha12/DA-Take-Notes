const baseURL = 'http://localhost:3000';

export const usePdfStore = defineStore('pdf', () => {
  const state = reactive({
    allPDFs: [],
    lastPDF: [],
    PDFNotizen: [],
  });

  const fetchPDFs = async () => {
    // const { data } = await axios.get('http://localhost:3000/uploads');
    const { data } = await axios.get(`${baseURL}/uploads`);
    state.allPDFs = data;
  };

  const selectPDF = async (pdfId) => {
    state.PDFNotizen = [];
    // Fetch PDF by ID (adjust the API endpoint as needed)
    const { data } = await axios.get(`http://localhost:3000/database/pdf/${pdfId}`);
    state.lastPDF = data;
    // Fetch notes for the PDF
    const { data: notes } = await axios.get(
      `http://localhost:3000/database/PDFnotiz/${data[0].id}`,
    );
    state.PDFNotizen = notes;
  };

  const postPDF = async (formdata, config, tempPDF) => {
    // const { data: datei } = await axios.post('http://localhost:3000/database/addPDF', tempPDF);
    // await axios.post('http://localhost:3000/uploads', formdata, config);

    await axios.post(`${baseURL}/uploads`, formdata, config);
    const { data: datei } = await axios.post(`${baseURL}/database/addPDF`, tempPDF);
    console.log('Sending tempPDF to DB:', tempPDF);
    fetchPDFs();
  };

  const deletePDF = async (name) => {
    // await axios.delete(`http://localhost:3000/uploads/${name}`);
    // await axios.delete(`http://localhost:3000/database/pdf/${name}`);

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
    getPDFnotizen(pdfID);
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
    selectPDF,
    getPDFnotizen,
    addNotiz,
    delNote,
    patchNote,
  };
});
