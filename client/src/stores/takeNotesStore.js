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
    allePPTs: [],
    pptNotizen: [],
    selectedPPT: {},
  });

  const getPPTNotes = async (pptID) => {
    const { data: notes } = await axios.get(`${baseURL}/database/pptNotizen/${pptID}`);
    state.pptNotizen = notes;
  };

  const selectPPT = async (id) => {
    state.pptNotizen = [];
    const { data } = await axios.get(`${baseURL}/database/pptDatei/${id}`);
    state.selectedPPT = data[0];
    const { data: notes } = await axios.get(`${baseURL}/database/pptNotizen/${id}`);
    state.pptNotizen = notes;
  };

  const getPPTs = async () => {
    const { data } = await axios.get(`${baseURL}/database/pptDateien`);
    state.allePPTs = data;
  };

  const insertPPT = async (src, width, height, name) => {
    await axios.post(`${baseURL}/database/pptDatei`, {
      src: src,
      width: width,
      height: height,
      name: name,
    });
    console.log('PowerPoint-Datei hinzugefügt');
    getPPTs();
  };

  const delPPT = async (pptID) => {
    await axios.delete(`${baseURL}/database/pptDatei/${pptID}`);
    console.log('PowerPoint-Datei gelöscht!');
    getPPTs();
  };

  const renamePPT = async (pptID, name) => {
    await axios.patch(`${baseURL}/database/pptDatei/${pptID}`, { name: name });
    getPPTs();
    selectPPT(pptID);
  };

  const postPPTNote = async (title, content, pptID) => {
    await axios.post(`${baseURL}/database/pptNotiz`, {
      title: title,
      content: content,
      userID: 1,
      pptID: pptID,
    });
    getPPTNotes(pptID);
  };

  const delNote = async (noteid, pptID) => {
    await axios.delete(`${baseURL}/database/pptNotiz/${noteid}`);
    getPPTNotes(pptID);
  };
  const patchNote = async (nid, title, content, pptID) => {
    await axios.patch(`${baseURL}/database/pptNotiz/${nid}`, { title: title, content: content });
    getPPTNotes(pptID);
  };

  return {
    state,
    insertPPT,
    delPPT,
    getPPTs,
    selectPPT,
    getPPTNotes,
    renamePPT,
    postPPTNote,
    delNote,
    patchNote,
  };
});

export const useYTStore = defineStore('yt', () => {
  const state = reactive({
    currentVideo: {},
    videoNotizen: [],
  });

  const selectVideo = async (id) => {
    state.videoNotizen = [];
    const { data } = await axios.get(`${baseURL}/database/video/${id}`);
    state.currentVideo = data[0];
    const { data: notes } = await axios.get(`${baseURL}/database/ytNotes/${id}`);
    state.videoNotizen = notes;
  };

  const getYouTubeNotizen = async (vid) => {
    const { data } = await axios.get(`${baseURL}/database/ytNotes/${vid}`);
    state.videoNotizen = data;
  };

  const postNote = async (title, content, videoID, time) => {
    try {
      await axios.post(`${baseURL}/database/ytNote`, {
        title: title,
        content: content,
        userID: 1,
        videoID: videoID,
        time: time,
      });
      getYouTubeNotizen(videoID);
    } catch (error) {
      console.log(error);
    }
  };

  const delNote = async (nid, vid) => {
    await axios.delete(`http://localhost:3000/database/ytNote/${nid}`);
    getYouTubeNotizen(vid);
  };

  const patchNote = async (nid, title, content, videoID) => {
    await axios.patch(`http://localhost:3000/database/ytNote/${nid}`, { title, content });
    getYouTubeNotizen(videoID);
  };

  const getNote = async (nid) => {};

  return { state, selectVideo, getYouTubeNotizen, postNote, delNote, patchNote };
});
