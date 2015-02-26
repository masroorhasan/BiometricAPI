var facerec = null;

module.exports = {
    facerec: function() {
        facerec = facerec || CVService.cv.FaceRecognizer.createLBPHFaceRecognizer();
        return facerec;
    }
};

