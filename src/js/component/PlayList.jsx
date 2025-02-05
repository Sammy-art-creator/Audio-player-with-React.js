import React, { useState, useRef, useEffect } from "react";

const Playlist = () => {
    // Base de la URL
    const BASE_URL = "https://playground.4geeks.com";

    // Estado para la lista de canciones
    const [songs, setSongs] = useState([]);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    // Fetch para obtener canciones desde la API correcta
    useEffect(() => {
        fetch("https://playground.4geeks.com/sound/songs")
            .then(response => response.json())
            .then(data => {

                if (Array.isArray(data)) {
                    setSongs(data);
                } else if (typeof data === "object" && data.songs) {
                    setSongs(data.songs);
                } else {
                }
            })
    }, []);

    // Función para cambiar a la siguiente canción
    const nextSong = () => {
        setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
        setIsPlaying(true);
    };

    // Función para ir a la canción anterior
    const prevSong = () => {
        setCurrentSongIndex((prevIndex) =>
            prevIndex === 0 ? songs.length - 1 : prevIndex - 1
        );
        setIsPlaying(true);
    };

    // Función para alternar entre Play/Pausa
    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Función para reproducir una canción seleccionada
    const playSong = (index) => {
        setCurrentSongIndex(index);
        setIsPlaying(true);
    };

    // Efecto para cargar y reproducir la canción cuando cambia el índice
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load();
            if (isPlaying) {
                audioRef.current.play();
            }
        }
    }, [currentSongIndex, isPlaying]);

    return (
        <div className="list-songs">
            <h1>Songs</h1>
            {songs.length === 0 ? (
                <p>Cargando canciones...</p>
            ) : (
                <ul className="list-group">
                    {songs.map((song, index) => (
                        <li className="list"
                            key={song.id}
                            onClick={() => playSong(index)}
                            style={{
                                cursor: "pointer",
                                fontWeight: index === currentSongIndex ? "bold" : "normal",
                                color: index === currentSongIndex ? "gray" : "white"
                            }}
                        >
                            {song.name} {index === currentSongIndex ? "" : ""}
                        </li>
                    ))}
                </ul>
            )}

            {songs.length > 0 && (
                <>


                    <audio ref={audioRef} src={`${BASE_URL}${songs[currentSongIndex]?.url}`} />

                    {/* Botones de control */}
                    <div className="buttons">
                        <button className="btn btn-secondary" onClick={prevSong}><i className="fa fa-step-backward"></i></button>
                        <button className="btn btn-secondary" onClick={togglePlayPause}>{isPlaying ? "⏸" : "▶"}</button>
                        <button className="btn btn-secondary" onClick={nextSong}><i className="fa fa-step-forward"></i></button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Playlist;
