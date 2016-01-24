<!DOCTYPE html>
<html>
	<head>
		<title>Full Player with Amplitude.js</title>
		<script type="text/javascript" src="js/plugins/amplitude.js"></script>
		<!-- jQuery only used to help with animations and NON Amplitude elements -->
		<!--<script type="text/javascript" src="js/jquery.min.js"></script>-->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
		<link rel="stylesheet" type="text/css" href="css/styles.css"/>
		<!--md5 jquery plugin thanks-> blueimp:  https://github.com/placemarker/jQuery-MD5 -->
		<script src="js/plugins/jquery.md5.js"></script>
		<!-- color pallet plugin thanks-> jariz: https://github.com/jariz/vibrant.js.git -->
		 <script src="js/plugins/Vibrant.js"></script>
	</head>
	<body>
		<div id="large-player">
			<!-- Begin Top Bar -->
			<div id="top-bar">
				<!-- Begin Buttons -->
				<div id="window-size-buttons">
					<div class="window-close"></div>
					<div class="window-min"></div>
					<div class="window-max"></div>
				</div>
				<!-- End Buttons -->

				<!-- Begin Controls -->
				<div id="large-player-controls">
					<div class="custom-prev" id="previous"></div>
					<div class="amplitude-play-pause amplitude-paused" amplitude-main-play-pause="true" id="play-pause"></div>
					<div class="custom-next" id="next"></div>
				</div>
				<!-- End Controls -->

				<!-- Begin Now Playing Song Display -->
				<div id="now-playing-song-display">
					<img id="top-bar-album-art" amplitude-song-info="cover"/>
					<div id="now-playing-song-meta-container">
						<div class="current-time">
							<span class="amplitude-current-minutes" amplitude-single-current-minutes="true">0</span>:<span class="amplitude-current-seconds" amplitude-single-current-seconds="true">00</span>
						</div>

						<span class="now-playing-title" amplitude-song-info="name"></span><br>
						<span class="album-information"><span amplitude-song-info="artist"></span> - <span amplitude-song-info="album"></span></span>

						<div class="time-duration">
							<span class="amplitude-duration-minutes" amplitude-single-duration-minutes="true">0</span>:<span class="amplitude-duration-seconds" amplitude-single-duration-seconds="true">00</span>
						</div>
						<div class="amplitude-song-time-visualization" amplitude-single-song-time-visualization="true" id="song-time-visualization"></div>
					</div>
				</div>
				<!-- End Now Playing Song Display -->

				<!-- Begin Right Side Search -->
				<div id="right-side-search-container">
					<a href="https://open.521dimensions.com/amplitudejs" target="_blank">
						<img src="images/small-amplitude.png" id="small-amplitude"/>
					</a>
					<input type="text" id="search" name="search" placeholder="Search"/>
				</div>
				<!-- End Right Side Search -->
			</div>
			<!-- End Top Bar -->

			<!-- Begin Left Content -->
			<div id="left-content">
				<div id="breadcrumbs" class="breadcrumbContainer">
					<span id="breadcrumLibrary" class="crumbs">Library</span>
				</div>
				<div id="artistPane">
					<span id="artistSlidePlaceholder"></span><!--Dynamic Artist Content Loaded Here-->
				</div><!--#artistSlide-->
				<div id="albumPane" style="display:none;">
					<span id="albumSlidePlaceholder"></span><!--Dynamic Album Content Loaded Here-->

				<!--<div class="album-container the-weatherman">
					<img src="images/theweatherman.jpg"/>
					<div class="album-meta">
						<div class="artist">Gregory Alan Isakov</div>
						<div class="album-info">The Weatherman</div>
					</div>
				</div>
				<div class="album-container rooms-for-adelaide">
					<img src="images/roomsforadelaide.jpg"/>
					<div class="album-meta">
						<div class="artist">Mia and Jonah </div>
						<div class="album-info">Rooms for Adelaide</div>
					</div>
				</div>
				<div class="album-container the-suburbs">
					<img src="images/thesuburbs.jpeg"/>
					<div class="album-meta">
						<div class="artist">The Arcade Fire</div>
						<div class="album-info">The Suburbs</div>
					</div>
				</div>-->
				</div><!--#albumSlide-->
			</div>
			<!-- End Left Content -->

			<!-- Begin Right Content -->
			<div id="right-content">
				<div id="album-display" class="album-display">
					<div id="album-header" class="album-header">
						<span id="albumHeaderPlaceholder"></span><!--Dynamic Album Header Here-->
						<!-- <img src="images/theweatherman.jpg"/>
						<div class="album-artist">Gregory Alan Isakov</div> -->
					</div>
					<div id="album-details"class="album-details"	>
						<span id="albumDetailsPlaceholder"></span><!--Dynamic Album Details Here-->
						<!-- <img class="album-art" src="images/theweatherman.jpg"/>
						<div class="album-contents">
							<div class="title">The Weatherman</div>
							<div class="song-title amplitude-song-container amplitude-play-pause" amplitude-song-index="0"><img src="images/now-playing.png"/>Living Proof</div>
							<div class="song-title amplitude-song-container amplitude-play-pause" amplitude-song-index="3"><img src="images/now-playing.png"/>Amsterdam</div>
							<div class="song-title amplitude-song-container amplitude-play-pause" amplitude-song-index="4"><img src="images/now-playing.png"/>Saint Valentine</div>
							<div class="song-title amplitude-song-container amplitude-play-pause" amplitude-song-index="5"><img src="images/now-playing.png"/>Second Chances</div>
						</div> -->
					</div>
				</div>

				<div id="now-playing-display" style="display: none;">
					<div id="now-playing-header" class="album-header">
						<span id="albumHeaderPlaceholder"></span><!--Dynamic Album Header Here-->
						<img src="images/openIconic/list-8x.png"/>
						<div class="album-artist">Now Playing Queue</div>
					</div>
					<div id="play-queue-details"class="table">
						<div id="play-queue-header" class="tableHeader">
							<div class="tableRow">
								<div class="tableCell headerCell">
									Title
								</div><!--.tableCell-->
								<div class="tableCell headerCell">
									Artist
								</div><!--.tableCell-->
								<div class="tableCell headerCell">
									Album
								</div><!--.tableCell-->
								<div class="tableCell headerCell">
									Length
								</div><!--.tableCell-->
							</div><!--.tableRow-->
						</div><!--#play-queue-header-->
						<div id="play-queue-body" class="tableBody">
						</div><!--#play-queue-body-->


					</div><!--play-queue-details-->
				</div>

			<!--<div class="album-display the-weatherman-display">
				<div class="album-header" id="the-weatherman-header">
					<img src="images/theweatherman.jpg"/>
					<div class="album-artist">Gregory Alan Isakov</div>
				</div>
				<div class="album-details">
					<img class="album-art" src="images/theweatherman.jpg"/>
					<div class="album-contents">
						<div class="title">The Weatherman</div>
						<div class="song-title amplitude-song-container amplitude-play-pause" amplitude-song-index="0"><img src="images/now-playing.png"/>Living Proof</div>
						<div class="song-title amplitude-song-container amplitude-play-pause" amplitude-song-index="3"><img src="images/now-playing.png"/>Amsterdam</div>
						<div class="song-title amplitude-song-container amplitude-play-pause" amplitude-song-index="4"><img src="images/now-playing.png"/>Saint Valentine</div>
						<div class="song-title amplitude-song-container amplitude-play-pause" amplitude-song-index="5"><img src="images/now-playing.png"/>Second Chances</div>
					</div>
				</div>
			</div>-->
			<!-- <div class="album-display rooms-for-adelaide-display">
				<div class="album-header" id="rooms-for-adelaide-header">
					<img src="images/roomsforadelaide.jpg"/>
					<div class="album-artist">Mia and Jonah</div>
				</div>
				<div class="album-details">
					<img class="album-art" src="images/roomsforadelaide.jpg"/>
					<div class="album-contents">
						<div class="title">Rooms for Adelaide</div>
						<div class="song-title amplitude-song-container amplitude-play-pause" amplitude-song-index="1"><img src="images/now-playing.png"/>Rooms</div>
					</div>
				</div>
			</div>
			<div class="album-display the-suburbs-display">
				<div class="album-header" id="the-suburbs-header">
					<img src="images/thesuburbs.jpeg"/>
					<div class="album-artist">The Arcade Fire</div>
				</div>
				<div class="album-details">
					<img class="album-art" src="images/thesuburbs.jpeg"/>
					<div class="album-contents">
						<div class="title">The Suburbs</div>
						<div class="song-title amplitude-song-container amplitude-play-pause" amplitude-song-index="2"><img src="images/now-playing.png"/>Suburban War</div>
						<div class="song-title amplitude-song-container amplitude-play-pause" amplitude-song-index="6"><img src="images/now-playing.png"/>City With No Children</div>
					</div>
				</div>
			</div> -->
		</div>
			<!-- End Right Content -->

			<!-- Begin Footer -->
			<div id="footer">
					<img id="nowPlayingIcon" src="images/openIconic/spreadsheet-2x.png" title="Now Playing">
			</div>
			<!-- End Footer -->
		</div>
		<div id="domCache" style="display: none;">
			<!--TBDHolds an ever growing list of previously grabbed information-->
		</div><!-- End Footer -->
	</body>
	<script type="text/javascript">

	Amplitude.init({
		"dynamic_mode": true,
			"callbacks": {
				"after_init":"after_init_callback",
		        "after_next":"after_next_callback",
		        "after_prev":"after_prev_callback"
			}
		});

		//callbacks

		function after_init_callback() {
			//setDurationOfActiveSong();
		}

		function after_next_callback() {
			nextSong();
			//setDurationOfActiveSong();
		}

		function after_prev_callback() {
			//setDurationOfActiveSong();
		}

		function album_change(){
			var activeSong = Amplitude.getActiveSongMetadata();

			$('.album-display').show();
			$('.album-container').removeClass('active-album-container');

			switch( activeSong.album ){
				case 'The Weatherman':
					$('.the-weatherman-display').show();
					$('.the-weatherman').addClass('active-album-container');
				break;
				case 'Rooms For Adelaide':
					$('.rooms-for-adelaide-display').show();
					$('.rooms-for-adelaide').addClass('active-album-container');
				break;
				case 'The Suburbs':
					$('.the-suburbs-display').show();
					$('.the-suburbs').addClass('active-album-container');
				break;
			}
		}
		$('.album-container').click(function(){
			$('.album-display').show();
			$('.album-container').removeClass('active-album-container');

			if( $(this).hasClass('the-weatherman') ){
				$('.the-weatherman-display').show();
				$('.the-weatherman').addClass('active-album-container');
			}

			if( $(this).hasClass('rooms-for-adelaide') ){
				$('.rooms-for-adelaide-display').show();
				$('.rooms-for-adelaide').addClass('active-album-container');
			}

			if( $(this).hasClass('the-suburbs') ){
				$('.the-suburbs-display').show();
				$('.the-suburbs').addClass('active-album-container');
			}
		});
	</script>




	<div id="settings" class="foreground primaryText">
			<h2>Subsonic Server Credentials</h2>
			<div class="row">
				<div class="col-md-8 col-md-offset-2">
					<div class="form-group foreground" >
						<label for="subServer">Server Address</label>
						<input id="subServer" type="text" class="textCenter form-control" value="http://hewitt.subsonic.org">
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-md-8 col-md-offset-2">
					<div class="form-group">
						<label for="subUsername">Username</label>
						<input id="subUsername" type="text" class="form-control textCenter" value="">
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-md-8 col-md-offset-2">
					<div class="form-group">
						<input id="subPassword"type="password" class="form-control textCenter" value="">
						<label for="subPassword">Password</label>
					</div>
				</div>
			</div>
			<button id="checkServer" type="submit" value="checkServer" class="btn btn-default primaryText secondaryBackground">Check Server</button><span id="loginStatus"><!--Content for connection status--></span>
			<div class="row loading">
				<div id="loginLoading" class="col-md-8 col-md-offset-2" style="display:none;">
					<img src="images/loading.gif"/>
				</div><!--#loginLoading-->
			</div>
		</div><!--#settings-->


		<!--custom JS -->
		<script src="js/classes/SubsonicAPI.js"></script>
		<script src="js/classes/player.js"></script>
		<script src="js/misc.js"></script>

<script type="text/javascript">

</script>




</html>
