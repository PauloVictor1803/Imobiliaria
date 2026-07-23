export const isYouTubeUrl = (url: string) => {
  return /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(url);
};

export const getYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const getYouTubeThumbnail = (url: string) => {
  const id = getYouTubeId(url);
  if (id) {
    return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  }
  return url;
};
