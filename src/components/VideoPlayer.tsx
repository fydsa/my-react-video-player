import { useState, useRef } from 'react';
import useVideoState from '../hooks/useVidoeState';
import styled from 'styled-components';
import RadioButton from './RadioButton';
import { BsFillPlayCircleFill, BsPauseCircleFill } from 'react-icons/bs';
import {
	IoVolumeMedium,
	IoVolumeHigh,
	IoVolumeOff,
	IoVolumeLow,
	IoSettingsSharp,
} from 'react-icons/io5';
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from 'react-icons/ai';

interface IPropsSubtitleWrapper {
	showActionbar: boolean;
}

interface IPropsVolumeProgressSlider {
	progressbar?: number;
	bufferedbar?: number;
	onClick?: any;
}

interface IPropsChaptersWrapper {
	showChapters: boolean;
}

// interface any {
// 	disabled: boolean;
// 	onClick: () => any;
// 	tabIndex: number;
// }

const VideoPlayer = () => {
	const container_ref = useRef<HTMLDivElement>(null);
	const video_ref = useRef<HTMLVideoElement>(null);
	const progress_ref = useRef<HTMLInputElement>(null);
	const volume_ref = useRef<HTMLInputElement>(null);

	const {
		isPlaying,
		isWaiting,
		progress,
		buffered,
		isMuted,
		volume,
		volume_level,
		currentTime,
		duration,
		activeSubtitle,
		playbackRate,
		isFullScreen,
		volumeHandler,
		togglePlay,
		progressHandler,
		timeUpdateHandler,
		loadMetaDataHandler,
		toggleFullScreen,
		// canPlayHandler,
		subtitleHandler,
		muteHandler,
		playbackHandler,
	} = useVideoState(video_ref);

	const [showVolumebar, setShowVolumbar] = useState<boolean>(false);
	const [showChapters, setShowChapters] = useState<boolean>(false);
	const [showSubtitles, setShowSubtitles] = useState<boolean>(false);
	const [showActionbar, setShowActionbar] = useState<boolean>(false);
	const [showPlaybackRates, setShowPlaybackRates] = useState<boolean>(false);

	const toggleSubtitlesHandler = () => {
		setShowSubtitles((prevState) => !prevState);
		subtitleHandler();
	};

	const volumeParentClick = (e: Event) => {
		e.stopPropagation();
	};

	const overlayPlayToggler = (e: any) => {
		console.log('hey clikc');
		e.stopPropagation();
		togglePlay();
	};

	const play_back_rates = [
		{ name: '1.5X', value: 1.5 },
		{ name: '1.25X', value: 1.25 },
		{ name: 'Normal', value: 1 },
		{ name: '0.25X', value: 0.25 },
		{ name: '0.5X', value: 0.5 },
	];

	const subtitleSrc = [];

	const chaptersSrc = [];

	return (
		<VideoWrapper
			ref={container_ref}
			onClick={overlayPlayToggler}
			role='button'
			tabIndex={0}
			onMouseEnter={() => setShowActionbar(true)}
			onMouseLeave={() => setShowActionbar(false)}
		>
			<video
				ref={video_ref}
				src={
					'https://imdb-video.media-imdb.com/vi1023514905/1434659607842-pgv4ql-1616202457209.mp4?Expires=1675055844&Signature=kgdoNqZ8K8AzOM04uD-3ySftzKlk6tlOH4My2QmOdNVtt4~a7NhkoKkOT-0tTDboL6lbJ1UNss1R4X3mRiIwErI16~XzP7bu3PI07IVT6l4zf-p61eXVzL2EQi1eoq8uGOhL9QKy2RxBpML9UB~NaQnkmNtCU7eVZpgkJFLPzFwmX4x~ZQBNwkHVfhL6ub4-qnP5iwjZ4GoAtK4FkUP8KMI0-0jkg5xWsmr128p5wPCKIJGeff3-waquwdHLccjZ9WqAJv~tHOoHct90RCAULInPmc2MrcVKAT4pVC75Lp0tBw2Nyum4GCqdCRIw7l-4xWjz73y8R3NgmWv9-4gtFQ__&Key-Pair-Id=APKAIFLZBVQZ24NQH3KA'
				}
				onTimeUpdate={timeUpdateHandler}
				onLoadedMetadata={loadMetaDataHandler}
				// poster = {}
				preload='auto'
				playsInline={true}
			>
				{/* <track
					kind='chapters'
					// src=''
					srcLang='en'
					default
				/>
				<track
					kind='subtitles'
					// src=''
					srcLang='en'
					label='English'
					default={false}
				/> */}
			</video>
			{showSubtitles && (
				<SubtitleWrapper showActionbar={showActionbar}>
					<div>{activeSubtitle}</div>
				</SubtitleWrapper>
			)}
			{isWaiting && <VideoOverlay>Loading...</VideoOverlay>}
			<ActionsWrapper onClick={(e) => e.stopPropagation()}>
				<ProgressSlider
					value={progress}
					min={0}
					max={100}
					type='range'
					onChange={progressHandler}
					ref={progress_ref}
					progressbar={
						progress_ref.current
							? (progress / 100) *
							  progress_ref.current?.offsetWidth
							: 0
					}
					bufferedbar={
						progress_ref.current
							? (buffered / 100) *
							  progress_ref.current?.offsetWidth
							: 0
					}
				/>
				<ControlButton
					tabIndex={0}
					role='button'
					title='toggle-play'
					onClick={togglePlay}
					id='play-pause'
				>
					{!isPlaying ? (
						<BsFillPlayCircleFill className='icon' />
					) : (
						<BsPauseCircleFill className='icon' />
					)}
				</ControlButton>
				<div className='time'>
					<span>
						{currentTime[0] !== 0 && `${currentTime[0]}:`}
						{`${currentTime[1]}:${currentTime[2]}`}
					</span>
					/
					<span>
						{duration[0] !== 0 && `${duration[0]}:`}
						{`${duration[1]}:${duration[2]}`}
					</span>
				</div>
				<div>
					{subtitleSrc.length > 0 && (
						<ControlButton
							title='caption'
							tabIndex={0}
							role='button'
							onClick={toggleSubtitlesHandler}
							disabled={!activeSubtitle}
						>
							CC
						</ControlButton>
					)}
					<ControlButton
						title='volume-handler'
						tabIndex={0}
						role='button'
						onMouseEnter={() => setShowVolumbar(true)}
						onMouseLeave={() => setShowVolumbar(false)}
						onClick={muteHandler}
						id='VolButton_WideScreens'
					>
						{!isMuted &&
							(volume_level === 'high' ? (
								<IoVolumeHigh className='icon' />
							) : volume_level === 'medium' ? (
								<IoVolumeMedium className='icon' />
							) : volume_level === 'low' ? (
								<IoVolumeLow className='icon' />
							) : (
								<IoVolumeOff className='icon' />
							))}
						{isMuted && <IoVolumeOff className='icon' />}
						{showVolumebar && (
							<VolumeSlider
								onClick={volumeParentClick}
								progressbar={(volume / 100) * 8}
							>
								<input
									value={volume}
									onChange={volumeHandler}
									type='range'
									min={0}
									max={100}
									ref={volume_ref}
								/>
							</VolumeSlider>
						)}
					</ControlButton>
					<ControlButton
						tabIndex={0}
						role='button'
						title='fullScreen-toggle'
						onClick={toggleFullScreen}
						id='FSButton_WideScreens'
					>
						{isFullScreen ? (
							<AiOutlineFullscreenExit className='icon' />
						) : (
							<AiOutlineFullscreen className='icon' />
						)}
					</ControlButton>
					{chaptersSrc.length > 0 && (
						<ControlButton
							title='chapters'
							tabIndex={0}
							role='button'
							onMouseEnter={() => setShowChapters(true)}
							onMouseLeave={() => setShowChapters(false)}
						>
							{/* chapters icon */}
							<ChaptersWrapper
								id='chapters'
								showChapters={showChapters}
							>
								<li>Chapters</li>
							</ChaptersWrapper>
						</ControlButton>
					)}
					<ControlButton
						tabIndex={0}
						role='button'
						title='settings'
						onMouseEnter={() => setShowPlaybackRates(true)}
						onMouseLeave={() => setShowPlaybackRates(false)}
					>
						<IoSettingsSharp className='icon' />
						{showPlaybackRates && (
							<PlaybackRatesWrapper>
								{play_back_rates.map((el, i) => {
									return (
										<RadioButton
											key={i}
											name={el.name}
											value={el.value}
											checked={el.value === playbackRate}
											onChange={playbackHandler}
										/>
									);
								})}
							</PlaybackRatesWrapper>
						)}
					</ControlButton>
				</div>
			</ActionsWrapper>
			<ControlButton
				tabIndex={0}
				role='button'
				title='fullScreen-toggle'
				onClick={toggleFullScreen}
				visible={showActionbar}
				id='FSButton_SmallScreens'
			>
				{isFullScreen ? (
					<AiOutlineFullscreenExit className='icon' />
				) : (
					<AiOutlineFullscreen className='icon' />
				)}
			</ControlButton>
			<ControlButton
				title='volume-handler'
				tabIndex={0}
				role='button'
				onMouseEnter={() => setShowVolumbar(true)}
				onMouseLeave={() => setShowVolumbar(false)}
				onClick={muteHandler}
				visible={showActionbar}
				id='VolButton_SmallScreens'
			>
				{/* icon */}
				{showVolumebar && (
					<VolumeSlider
						onClick={volumeParentClick}
						progressbar={(volume / 100) * 8}
					>
						<input
							value={volume}
							onChange={volumeHandler}
							type='range'
							min={0}
							max={100}
							ref={volume_ref}
						/>
					</VolumeSlider>
				)}
			</ControlButton>
		</VideoWrapper>
	);
};

const VideoWrapper = styled.div`
	margin: auto;
	top: 10vh;
	width: 65vw;
	@media screen and (max-width: 820px) {
		width: 100vw;
		top: 0;
	}
	height: 65vh;
	display: flex;
	flex-direction: column;
	position: relative;
	cursor: pointer;
	:fullscreen {
		video {
			margin: auto 0;
			height: 100vh;
		}
	}
	video {
		::-webkit-media-text-track-container {
			display: none !important;
		}
		::-webkit-media-controls {
			display: none !important;
		}
		::-webkit-media-controls-enclosure {
		}
		width: 100%;
		height: 100%;
		background-color: var(--primary-gray-600);
		border-radius: 0.8em;
	}
	.icon {
		font-size: 1.5em;
	}
`;

const ActionsWrapper = styled.div`
	background-color: var(--primary-gray-700);
	/* display: flex;
    padding: 0 0.5rem; */
	align-items: center;
	height: 57px;
	width: 100%;
	/* justify-content: space-between; */
	width: 100%;
	position: absolute;
	bottom: 0;
	opacity: 0;
	transition-duration: 0.15s;
	transition: opacity 0.5s ease-out 2s;
	display: grid;
	grid-template-columns: min-content min-content auto min-content;
	grid-column-gap: 0.5rem;
	border-radius: 0 0 0.8em 0.8em;
	> div:not(#play-pause):not(.time) {
		justify-self: end;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		position: relative;
		height: 100%;
	}
	cursor: initial;
	@media screen and (max-width: 575px) {
		height: 40px;
		grid-column-gap: 0;
	}
	${VideoWrapper}:hover & {
		/* background-color: red; */
		opacity: 1;
		transition: opacity 0.5s ease-out 0s;
	}
	> .time {
		color: var(--primary-gray-50);
		/* padding: © 1rem;
    */
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		font-weight: 500;
		font-size: 0.9em;
		@media screen and (max-width: 575px) {
			padding: 0 0.5rem;
			width: 100%;
		}
	}
`;

const ProgressSlider = styled.input<IPropsVolumeProgressSlider>`
	-webkit-appearance: none !important;
	cursor: pointer;
	/* margin: 0 1rem; */
	position: absolute;
	top: -0.5em;
	width: 100%;
	left: -0.1em;
	right: 0;
	::-webkit-slider-runnable-track {
		background: var(---primary-gray-50);
		height: 0.4em;
		width: 100%;
		box-shadow: ${(props) =>
			`inset ${props.progressbar}px 0 var(--primary-red-700), inset ${props.bufferedbar}px 0 var(--primary-gray-500)`};
	}
	::-webkit-slider-thumb {
		height: 0em;
		width: 0em;
		border-radius: 50%;
		background-color: var(--primary-red-700);
		margin-top: -0.15em;
		-webkit-appearance: none;
	}
	:-moz-range-track {
		background: var(---primary-gray-50);
		height: 0.4em;
		width: 100%;
		box-shadow: ${(props) =>
			`inset ${props.progressbar}px 0 var(--primary-red-700), inset ${props.bufferedbar}px 0 var(--primary-gray-500)`};
	}
	::-ms-track {
		background: var(---primary-gray-50);
		height: 0.4em;
		width: 100%;
		box-shadow: ${(props) =>
			`inset ${props.progressbar}px 0 var(--primary-red-700), inset ${props.bufferedbar}px 0 var(--primary-gray-500)`};
	}
	::-moz-range-thumb {
		height: 100%;
		width: 0;
		-webkit-appearance: none;
	}
`;

const VolumeSlider = styled.div<IPropsVolumeProgressSlider>`
	width: 7rem;
	/* position: absolute; */
	height: 100%;
	display: flex;
	align-items: center;
	padding: 0 0.8rem 0 0.6em;
	z-index: 10;
	cursor: initial;
	> input {
		-webkit-appearance: none;
		cursor: pointer;
		bottom: 0;
		::-webkit-slider-runnable-track {
			height: 0.25em;
			width: 100%;
			background-color: rgb(62 61 61 / 57%);
			box-shadow: ${(props) =>
				`inset ${props.progressbar}rem 0 var(--primary-gray-50)`};
		}

		::-webkit-slider-thumb {
			width: 1em;
			height: 1em;
			background-color: var(--primary-gray-50);
			border-radius: 50%;
			-webkit-appearance: none;
			margin-top: -0.35em;
		}
	}
`;

const ChaptersWrapper = styled.div<IPropsChaptersWrapper>`
	position: absolute;
	width: 289px;
	visibility: ${(props) => props.showChapters === false && 'hidden'};
	bottom: 57px;
	right: -2.6rem;
	background: rgba(0, 0, 0, 0.9);
	padding-left: 0;
	margin: 0;
	z-index: 3;
	li {
		list-style-type: none;
		padding-left: 4px;
		display: flex;
		align-items: center;
		min-height: 30px;
		padding: 7px 10px;
		button {
			font-weight: 400;
			font-size: 16px;
			line-height: 19px;
			color: var(---primary-gray-50);
			border: 0;
			background-color: transparent;
			height: 100%;
			width: 100%;
			text-align: left;
			cursor: pointer;
		}
		border-bottom: 1px solid rgba(210, 210, 210, 0.1);
	}
	> li:first-of-type {
		font-weight: 700;
		font-size: 20px;
		line-height: 24px;
		color: var(---primary-gray-50);
	}
	@media screen and (max-width: 575px) {
		bottom: 40px;
		width: 200px;
		max-height: 20rem;
		right: -3.3rem;
		overflow-y: auto;
		li {
			button {
				font-size: 14px;
			}
		}
		> li:first-of-type {
			font-size: 18px;
		}
	}
`;

const VideoOverlay = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	font-size: 32px;
	color: #fff;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const ControlButton = styled.div<any>`
	background-color: transparent;
	border: 0;
	font-weight: 700;
	font-size: 16px;
	line-height: 19px;
	text-align: center;
	color: ${(props) => (props.disabled ? '#888' : '#fff')};
	position: relative;
	height: 100%;
	padding: 0 0.5rem;
	display: flex;
	align-items: center;
	justify-self: center;
	cursor: pointer;
	> i {
		vertical-align: middle;
		font-size: 25px;
	}

	> img {
		width: 2rem;
		padding-bottom: 0.5rem;
	}

	&#FSButton_SmallScreens,
	&#VolButton_SmallScreens {
		display: none;
	}

	@media screen and (max-width: 575px) {
		font-size: 14px;
		> i {
			font-size: 18px;
		}
		> img {
			width: 1.7rem;
			padding-bottom: 0.4rem;
		}
		&#FSButton_WideScreens,
		&#VolButton_WideScreens {
			display: none;
		}
		&#FSButton_SmallScreens,
		&#VolButton_SmallScreens {
			display: inline-block;
			position: absolute;
			top: 0;
			height: max-content;
			padding: 1rem;
			visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};
			transition: visibility 25;
		}
		&#VolButton_SmallScreens {
			right: 0;
		}
	}
`;

const SubtitleWrapper = styled.div<IPropsSubtitleWrapper>`
	position: absolute;
	bottom: ${(props) => (props.showActionbar ? '6rem' : '1rem')};
	transition-duration: 0.15s;
	transition: bottom 0.5s ease-out 2.5s;
	display: flex;
	justify-content: center;
	align-self: center;
	width: 100%;
	height: 2.5em;
	z-index: 1;
	> div {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		align-self: center;
		background-color: rgb (54 54 54 1 85%);
		border-radius: 5px;
		justify-content: center;
		text-align: center;
		color: #fff;
	}
	:hover {
		bottom: 5rem;
		transition: bottom Os ease-out Os;
	}
	@media screen and (max-width: 575px) {
		bottom: ${(props) => (props.showActionbar ? '4rem' : '0')};
		padding: 0 1rem;
		> div {
			padding: 0.5rem;
			font-size: 12px;
		}
		:hover {
			bottom: 4rem;
		}
	}
`;

const PlaybackRatesWrapper = styled.div`
	position: absolute;
	/* padding: 0.5rem 0.7rem 0.5rem 1rem; */
	width: 8em;
	background-color: var(--primary-gray-700);
	right: -0.5em;
	bottom: 3.6em;
	border-radius: 5px;
	z-index: 10;
	@media screen and (max-width: 575px) {
		bottom: 3.7rem;
		width: max-content;
	}
`;

export default VideoPlayer;
