import { useState, useEffect, Ref } from 'react';

const useVideoState = (el: any) => {
	const [videoState, setVideoState] = useState({
		isPlaying: false,
		isWaiting: false,
		progress: 0,
		buffered: 0,
		isMuted: false,
		volume: 50,
		currentTime: 0,
		duration: 0,
		isLoading: true,
		showSubtitles: true,
		activeSubtitles: '',
		playbackRate: 1,
		isFullScreen: false,
	});

	const volumeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.stopPropagation();
		const volume: number = Number(e.target.value);
		el.current.volume = (volume / 100).toFixed(2);
		setVideoState({
			...videoState,
			volume,
		});
	};

	const muteHandler = (e: Event) => {
		e.stopPropagation();
		el.current.muted = !el.current.muted;
		setVideoState({ ...videoState, isMuted: !videoState.isMuted });
	};

	const togglePlay = () => {
		const element = el.current;
		!videoState.isPlaying ? element.play() : element.pause();
		setVideoState({
			...videoState,
			isPlaying: !videoState.isPlaying,
		});
	};

	const progressHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		const progress = e.target.value;
		el.current.currentTime = (el.current.duration * Number(progress)) / 100;
		setVideoState({
			...videoState,
			currentTime: el.current.currentTime,
			progress: Number(progress),
		});
	};

	const timeUpdateHandler = () => {
		const progress = (el.current.currentTime / el.current.duration) * 100;
		const buffered =
			(el.current.buffered.end(0) / el.current.duration) * 100;
		setVideoState({
			...videoState,
			progress,
			currentTime: el.current.currentTime,
			buffered,
		});
	};

	const loadMetaDataHandler = () => {
		setVideoState({
			...videoState,
			duration: el.current?.duration,
			isLoading: true,
		});

		const chapters_track_el: any = document.querySelector(
			'track[kind="chapters"]'
		);
		const chapters_text_track = chapters_track_el?.track;

		if (chapters_track_el && chapters_text_track) {
			for (let i = 0; i < chapters_text_track.cues.length; i++) {
				const li_el = document.createElement('li');
				const button_el = document.createElement('button');
				const chapter_name = chapters_text_track.cues[i].text;

				button_el.setAttribute(
					'id',
					chapters_text_track.cues[i].startTime
				);
				button_el.setAttribute('tebIndex', '0');

				button_el.appendChild(document.createTextNode(chapter_name));

				li_el.appendChild(button_el);

				document.querySelector('#chapters')?.appendChild(li_el);

				button_el.addEventListener(
					'click',
					() => {
						el.current.currentTime =
							chapters_text_track.cues[i].startTime;
					},
					false
				);
			}
		}
	};

	const subtitleHandler = () => {
		const subtitle_track_el: any = document.querySelector(
			'track[kind="subtitles"]'
		);
		const subtitles_text_track = subtitle_track_el?.track;

		if (subtitles_text_track?.mode === 'disabled') {
			subtitles_text_track.mode = 'showing';
		} else if (subtitles_text_track?.mode === 'showing') {
			subtitles_text_track.mode = 'disabled';
		}

		const active_track = subtitles_text_track?.activeCues
			? subtitles_text_track.activeCues[0]?.text
			: null;

		if (active_track) {
			setVideoState({ ...videoState, activeSubtitles: active_track });
		}

		return subtitles_text_track?.mode === 'showing';
	};

	const getTimeValues = (value: number) => {
		const hours = Math.floor((value % (60 * 60 * 24)) / (60 * 60));
		const minutes = Math.floor((value % (60 * 60)) / 60);
		const seconds = Math.floor(value % 60);

		return [
			formatValues(hours),
			formatValues(minutes),
			formatValues(seconds),
		];
	};

	const formatValues = (value: number) => {
		const formatted_value =
			value !== 0 && String(value).length === 1
				? String(value).padStart(2, '0')
				: value;

		return formatted_value;
	};

	const toggleFullScreen = () => {
		const element = el.current.parentNode;
		if (!document.fullscreenElement) {
			if (element.requestFullScreen) {
				element.requestFullScreen();
			} else if (element.webkitRequestFullScreen) {
				element.webkitRequestFullScreen();
			} else if (element.msRequestFullScreen) {
				element.msRequestFullScreen();
			}
		} else {
			document.exitFullscreen();
		}
		setVideoState({
			...videoState,
			isFullScreen: !videoState.isFullScreen,
		});
	};

	const waitingHanlder = () => {
		setVideoState({ ...videoState, isWaiting: true });
	};

	const playHanlder = () => {
		setVideoState({ ...videoState, isPlaying: true, isWaiting: false });
	};

	const pauseHandler = () => {
		setVideoState({ ...videoState, isPlaying: false, isWaiting: false });
	};

	const volumeGenerator = () => {
		const volume_num = Number(videoState.volume);

		let volume_level =
			volume_num > 65
				? 'high'
				: volume_num > 35
				? 'medium'
				: volume_num > 1
				? 'low'
				: 'mute';

		return volume_level;
	};

	const playbackHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		const new_value = Number(e.target.value);
		setVideoState({ ...videoState, playbackRate: new_value });
		el.current.playbackRate = new_value;
	};

	useEffect(() => {
		const element = el.current;

		element.addEventListener('waiting', waitingHanlder);
		element.addEventListener('play', playHanlder);
		element.addEventListener('playing', playHanlder);
		element.addEventListener('pause', pauseHandler);

		return () => {
			element.removeEventListener('waiting', waitingHanlder);
			element.removeEventListener('play', playHanlder);
			element.removeEventListener('playing', playHanlder);
			element.removeEventListener('pause', pauseHandler);
		};
	}, [el, videoState]);

	return {
		isPlaying: videoState.isPlaying,
		isWaiting: videoState.isWaiting,
		progress:
			videoState.duration !== 0
				? (videoState.currentTime / videoState.duration) * 100
				: 0,
		buffered: videoState.buffered,
		isMuted: videoState.isMuted,
		volume: videoState.volume,
		volume_level: volumeGenerator(),
		currentTime: getTimeValues(Math.round(videoState.currentTime)),
		duration: getTimeValues(Math.round(videoState.duration)),
		isLoading: videoState.isLoading,
		isFullScreen: videoState.isFullScreen,
		showSubtitles: subtitleHandler(),
		playbackRate: videoState.playbackRate,
		activeSubtitle: videoState.activeSubtitles,
		volumeHandler,
		togglePlay,
		progressHandler,
		timeUpdateHandler,
		loadMetaDataHandler,
		toggleFullScreen,
		subtitleHandler,
		muteHandler,
		playbackHandler,
	};
};

export default useVideoState;
