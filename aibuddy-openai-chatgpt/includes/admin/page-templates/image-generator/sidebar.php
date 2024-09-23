<?php
$general_setting = get_option( 'ai_buddy', array() );

$dropdown_images = array(
	'Artist'          => array(
		'id'              => 'images-artist-options',
		'option_selected' => isset( $general_setting['image_generator']['artist'] ) ? $general_setting['image_generator']['artist'] : 'None',
		'option'          => array(
			'Salvador Dalí'             => 'Salvador Dalí',
			'Leonardo da Vinci'         => 'Leonardo da Vinci',
			'Michelangelo'              => 'Michelangelo',
			'Albrecht Dürer'            => 'Albrecht Dürer',
			'Alfred Sisley'             => 'Alfred Sisley',
			'Andrea Mantegna'           => 'Andrea Mantegna',
			'Andy Warhol'               => 'Andy Warhol',
			'Amedeo Modigliani'         => 'Amedeo Modigliani',
			'Camille Pissarro'          => 'Camille Pissarro',
			'Caravaggio'                => 'Caravaggio',
			'Caspar David Friedrich'    => 'Caspar David Friedrich',
			'Cézanne'                   => 'Cézanne',
			'Claude Monet'              => 'Diego Velázquez',
			'Eugène Delacroix'          => 'Eugène Delacroix',
			'Frida Kahlo'               => 'Frida Kahlo',
			'Gustav Klimt'              => 'Gustav Klimt',
			'Henri Matisse'             => 'Henri Matisse',
			'Henri de Toulouse-Lautrec' => 'Henri de Toulouse-Lautrec',
			'Jackson Pollock'           => 'Jackson Pollock',
			'Jasper Johns'              => 'Jasper Johns',
			'Joan Miró'                 => 'Joan Miró',
			'John Singer Sargent'       => 'John Singer Sargent',
			'Johannes Vermeer'          => 'Johannes Vermeer',
			'Mary Cassatt'              => 'Mary Cassatt',
			'M. C. Escher'              => 'M. C. Escher',
			'Paul Cézanne'              => 'Paul Cézanne',
			'Paul Gauguin'              => 'Paul Gauguin',
			'Paul Klee'                 => 'Paul Klee',
			'Pierre-Auguste Renoir'     => 'Pierre-Auguste Renoir',
			'Pieter Bruegel the Elder'  => 'Pieter Bruegel the Elder',
			'Piet Mondrian'             => 'Piet Mondrian',
			'Pablo Picasso'             => 'Pablo Picasso',
			'Rembrandt'                 => 'Rembrandt',
			'René Magritte'             => 'René Magritte',
			'Raphael'                   => 'Raphael',
			'Sandro Botticelli'         => 'Sandro Botticelli',
			'Titian'                    => 'Titian',
			'Theo van Gogh'             => 'Theo van Gogh',
			'Vincent van Gogh'          => 'Vincent van Gogh',
			'Vassily Kandinsky'         => 'Vassily Kandinsky',
			'Winslow Homer'             => 'Winslow Homer',
			'None'                      => 'None',
		),
	),
	'Style'           => array(
		'id'              => 'images-style-options',
		'option_selected' => isset( $general_setting['image_generator']['style'] ) ? $general_setting['image_generator']['style'] : 'None',
		'option'          => array(
			'Surrealism'             => 'Surrealism',
			'Abstract'               => 'Abstract',
			'Abstract Expressionism' => 'Abstract Expressionism',
			'Action painting'        => 'Action painting',
			'Art Brut'               => 'Art Brut',
			'Art Deco'               => 'Art Deco',
			'Art Nouveau'            => 'Art Nouveau',
			'Baroque'                => 'Baroque',
			'Byzantine'              => 'Byzantine',
			'Classical'              => 'Classical',
			'Color Field'            => 'Color Field',
			'Conceptual'             => 'Conceptual',
			'Cubism'                 => 'Cubism',
			'Dada'                   => 'Dada',
			'Expressionism'          => 'Expressionism',
			'Fauvism'                => 'Fauvism',
			'Figurative'             => 'Figurative',
			'Futurism'               => 'Futurism',
			'Gothic'                 => 'Gothic',
			'Hard-edge painting'     => 'Hard-edge painting',
			'Hyperrealism'           => 'Hyperrealism',
			'Impressionism'          => 'Impressionism',
			'Japonisme'              => 'Japonisme',
			'Luminism'               => 'Luminism',
			'Lyrical Abstraction'    => 'Lyrical Abstraction',
			'Mannerism'              => 'Mannerism',
			'Minimalism'             => 'Minimalism',
			'Naive Art'              => 'Naive Art',
			'New Realism'            => 'New Realism',
			'Neo-expressionism'      => 'Neo-expressionism',
			'Neo-pop'                => 'Neo-pop',
			'Op Art'                 => 'Op Art',
			'Opus Anglicanum'        => 'Opus Anglicanum',
			'Outsider Art'           => 'Outsider Art',
			'Pop Art'                => 'Pop Art',
			'Photorealism'           => 'Photorealism',
			'Pointillism'            => 'Pointillism',
			'Post-Impressionism'     => 'Post-Impressionism',
			'Realism'                => 'Realism',
			'Renaissance'            => 'Renaissance',
			'Rococo'                 => 'Rococo',
			'Romanticism'            => 'Romanticism',
			'Street Art'             => 'Street Art',
			'Superflat'              => 'Superflat',
			'Symbolism'              => 'Symbolism',
			'Tenebrism'              => 'Tenebrism',
			'Ukiyo-e'                => 'Ukiyo-e',
			'Western Art'            => 'Western Art',
			'YBA'                    => 'YBA',
			'None'                   => 'None',
		),
	),
	'Photography'     => array(
		'id'              => 'images-photography-options',
		'option_selected' => isset( $general_setting['image_generator']['photography'] ) ? $general_setting['image_generator']['photography'] : 'None',
		'option'          => array(
			'Portrait'         => 'Portrait',
			'Landscape'        => 'Landscape',
			'Abstract'         => 'Abstract',
			'Action'           => 'Action',
			'Aerial'           => 'Aerial',
			'Agricultural'     => 'Agricultural',
			'Animal'           => 'Animal',
			'Architectural'    => 'Architectural',
			'Architectural'    => 'Architectural',
			'Astrophotography' => 'Astrophotography',
			'Bird photography' => 'Bird photography',
			'Black and white'  => 'Black and white',
			'Candid'           => 'Candid',
			'Cityscape'        => 'Cityscape',
			'Close-up'         => 'Close-up',
			'Commercial'       => 'Commercial',
			'Conceptual'       => 'Conceptual',
			'Corporate'        => 'Corporate',
			'Documentary'      => 'Documentary',
			'Event'            => 'Event',
			'Family'           => 'Family',
			'Fashion'          => 'Fashion',
			'Fine art'         => 'Fine art',
			'Food'             => 'Food',
			'Food photography' => 'Food photography',
			'Glamour'          => 'Glamour',
			'Industrial'       => 'Industrial',
			'Lifestyle'        => 'Lifestyle',
			'Macro'            => 'Macro',
			'Nature'           => 'Nature',
			'Night'            => 'Night',
			'Product'          => 'Product',
			'Sports'           => 'Sports',
			'Street'           => 'Street',
			'Travel'           => 'Travel',
			'Underwater'       => 'Underwater',
			'Wedding'          => 'Wedding',
			'Wildlife'         => 'Wildlife',
			'None'             => 'None',
		),
	),
	'Lighting'        => array(
		'id'              => 'images-lighting-options',
		'option_selected' => isset( $general_setting['image_generator']['lighting'] ) ? $general_setting['image_generator']['lighting'] : 'None',
		'option'          => array(
			'Ambient'           => 'Ambient',
			'Artificial light'  => 'Artificial light',
			'Backlight'         => 'Backlight',
			'Black light'       => 'Black light',
			'Black light'       => 'Black light',
			'Candle light'      => 'Candle light',
			'Chiaroscuro'       => 'Chiaroscuro',
			'Cloudy'            => 'Cloudy',
			'Cloudy'            => 'Cloudy',
			'Continuous light'  => 'Continuous light',
			'Contre-jour'       => 'Contre-jour',
			'Direct light'      => 'Direct light',
			'Direct sunlight'   => 'Direct sunlight',
			'Diffused light'    => 'Diffused light',
			'Firelight'         => 'Firelight',
			'Flash'             => 'Flash',
			'Flat light'        => 'Flat light',
			'Fluorescent'       => 'Fluorescent',
			'Fog'               => 'Fog',
			'Front light'       => 'Front light',
			'Golden hour'       => 'Golden hour',
			'Hard light'        => 'Hard light',
			'Hazy sunlight'     => 'Hazy sunlight',
			'High key'          => 'High key',
			'Incandescent'      => 'Incandescent',
			'Key light'         => 'Key light',
			'LED'               => 'LED',
			'Low key'           => 'Low key',
			'Moonlight'         => 'Moonlight',
			'Natural light'     => 'Natural light',
			'Neon'              => 'Neon',
			'Open shade'        => 'Open shade',
			'Overcast'          => 'Overcast',
			'Paramount'         => 'Paramount',
			'Party lights'      => 'Party lights',
			'Photoflood'        => 'Photoflood',
			'Quarter light'     => 'Quarter light',
			'Reflected light'   => 'Reflected light',
			'Reflected light'   => 'Reflected light',
			'Shaded'            => 'Shaded',
			'Shaded light'      => 'Shaded light',
			'Silhouette'        => 'Silhouette',
			'Silhouette'        => 'Silhouette',
			'Silhouette'        => 'Silhouette',
			'Softbox'           => 'Softbox',
			'Soft light'        => 'Soft light',
			'Split lighting'    => 'Split lighting',
			'Stage lighting'    => 'Stage lighting',
			'Studio light'      => 'Studio light',
			'Sunburst'          => 'Sunburst',
			'Tungsten'          => 'Tungsten',
			'Umbrella lighting' => 'Umbrella lighting',
			'Underexposed'      => 'Underexposed',
			'Venetian blinds'   => 'Venetian blinds',
			'Warm light'        => 'Warm light',
			'White balance'     => 'White balance',
			'None'              => 'None',
		),
	),
	'Subject'         => array(
		'id'              => 'images-subject-options',
		'option_selected' => isset( $general_setting['image_generator']['subject'] ) ? $general_setting['image_generator']['subject'] : 'None',
		'option'          => array(
			'Landscapes'   => 'Landscapes',
			'People'       => 'People',
			'Animals'      => 'Animals',
			'Food'         => 'Food',
			'Cars'         => 'Cars',
			'Architecture' => 'Architecture',
			'Flowers'      => 'Flowers',
			'Still life'   => 'Still life',
			'Portrait'     => 'Portrait',
			'Cityscapes'   => 'Cityscapes',
			'Seascapes'    => 'Seascapes',
			'Nature'       => 'Nature',
			'Action'       => 'Action',
			'Events'       => 'Events',
			'Street'       => 'Street',
			'Abstract'     => 'Abstract',
			'Candid'       => 'Candid',
			'Underwater'   => 'Underwater',
			'Night'        => 'Night',
			'Wildlife'     => 'Wildlife',
			'None'         => 'None',
		),
	),
	'Camera'          => array(
		'id'              => 'images-camera-options',
		'option_selected' => isset( $general_setting['image_generator']['camera'] ) ? $general_setting['image_generator']['camera'] : 'None',
		'option'          => array(
			'Aperture'                        => 'Aperture',
			'Active D-Lighting'               => 'Active D-Lighting',
			'Auto Exposure Bracketing'        => 'Auto Exposure Bracketing',
			'Auto Focus Mode'                 => 'Auto Focus Mode',
			'Auto Focus Point'                => 'Auto Focus Point',
			'Auto Lighting Optimizer'         => 'Auto Lighting Optimizer',
			'Auto Rotate'                     => 'Auto Rotate',
			'Aspect Ratio'                    => 'Aspect Ratio',
			'Audio Recording'                 => 'Audio Recording',
			'Auto ISO'                        => 'Auto ISO',
			'Chromatic Aberration Correction' => 'Chromatic Aberration Correction',
			'Color Space'                     => 'Color Space',
			'Continuous Shooting'             => 'Continuous Shooting',
			'Distortion Correction'           => 'Distortion Correction',
			'Drive Mode'                      => 'Drive Mode',
			'Dynamic Range'                   => 'Dynamic Range',
			'Exposure Compensation'           => 'Exposure Compensation',
			'Flash Mode'                      => 'Flash Mode',
			'Focus Mode'                      => 'Focus Mode',
			'Focus Peaking'                   => 'Focus Peaking',
			'Frame Rate'                      => 'Frame Rate',
			'GPS'                             => 'GPS',
			'Grid Overlay'                    => 'Grid Overlay',
			'High Dynamic Range'              => 'High Dynamic Range',
			'Highlight Tone Priority'         => 'Highlight Tone Priority',
			'Image Format'                    => 'Image Format',
			'Image Stabilization'             => 'Image Stabilization',
			'Interval Timer Shooting'         => 'Interval Timer Shooting',
			'ISO'                             => 'ISO',
			'ISO Auto Setting'                => 'ISO Auto Setting',
			'Lens Correction'                 => 'Lens Correction',
			'Live View'                       => 'Live View',
			'Long Exposure Noise Reduction'   => 'Long Exposure Noise Reduction',
			'Manual Focus'                    => 'Manual Focus',
			'Metering Mode'                   => 'Metering Mode',
			'Movie Mode'                      => 'Movie Mode',
			'Movie Quality'                   => 'Movie Quality',
			'Noise Reduction'                 => 'Noise Reduction',
			'Picture Control'                 => 'Picture Control',
			'Picture Style'                   => 'Picture Style',
			'Quality'                         => 'Quality',
			'Self-Timer'                      => 'Self-Timer',
			'Shutter Speed'                   => 'Shutter Speed',
			'Time-lapse Interval'             => 'Time-lapse Interval',
			'Time-lapse Recording'            => 'Time-lapse Recording',
			'Virtual Horizon'                 => 'Virtual Horizon',
			'Video Format'                    => 'Video Format',
			'White Balance'                   => 'White Balance',
			'Zebra Stripes'                   => 'Zebra Stripes',
			'None'                            => 'None',
		),
	),
	'Composition'     => array(
		'id'              => 'images-composition-options',
		'option_selected' => isset( $general_setting['image_generator']['composition'] ) ? $general_setting['image_generator']['composition'] : 'None',
		'option'          => array(
			'Rule of Thirds'         => 'Rule of Thirds',
			'Asymmetrical'           => 'Asymmetrical',
			'Balance'                => 'Balance',
			'Centered'               => 'Centered',
			'Close-up'               => 'Close-up',
			'Color blocking'         => 'Color blocking',
			'Contrast'               => 'Contrast',
			'Cropping'               => 'Cropping',
			'Diagonal'               => 'Diagonal',
			'Documentary'            => 'Documentary',
			'Environmental Portrait' => 'Environmental Portrait',
			'Fill the Frame'         => 'Fill the Frame',
			'Framing'                => 'Framing',
			'Golden Ratio'           => 'Golden Ratio',
			'High Angle'             => 'High Angle',
			'Leading Lines'          => 'Leading Lines',
			'Long Exposure'          => 'Long Exposure',
			'Low Angle'              => 'Low Angle',
			'Macro'                  => 'Macro',
			'Minimalism'             => 'Minimalism',
			'Negative Space'         => 'Negative Space',
			'Panning'                => 'Panning',
			'Patterns'               => 'Patterns',
			'Photojournalism'        => 'Photojournalism',
			'Point of View'          => 'Point of View',
			'Portrait'               => 'Portrait',
			'Reflections'            => 'Reflections',
			'Saturation'             => 'Saturation',
			'Scale'                  => 'Scale',
			'Selective Focus'        => 'Selective Focus',
			'Shallow Depth of Field' => 'Shallow Depth of Field',
			'Silhouette'             => 'Silhouette',
			'Simplicity'             => 'Simplicity',
			'Snapshot'               => 'Snapshot',
			'Street Photography'     => 'Street Photography',
			'Symmetry'               => 'Symmetry',
			'Telephoto'              => 'Telephoto',
			'Texture'                => 'Texture',
			'Tilt-Shift'             => 'Tilt-Shift',
			'Time-lapse'             => 'Time-lapse',
			'Tracking Shot'          => 'Tracking Shot',
			'Travel'                 => 'Travel',
			'Triptych'               => 'Triptych',
			'Ultra-wide'             => 'Ultra-wide',
			'Vanishing Point'        => 'Vanishing Point',
			'Viewpoint'              => 'Viewpoint',
			'Vintage'                => 'Vintage',
			'Wide Angle'             => 'Wide Angle',
			'Zoom Blur'              => 'Zoom Blur',
			'Zoom In/Zoom Out'       => 'Zoom In/Zoom Out',
			'None'                   => 'None',
		),
	),
	'Resolution'      => array(
		'id'              => 'images-resolution-options',
		'option_selected' => isset( $general_setting['image_generator']['resolution'] ) ? $general_setting['image_generator']['resolution'] : '4K (3840x2160)',
		'option'          => array(
			'4K (3840x2160)'    => '4K (3840x2160)',
			'1080p (1920x1080)' => '1080p (1920x1080)',
			'720p (1280x720)'   => '720p (1280x720)',
			'480p (854x480)'    => '480p (854x480)',
			'2K (2560x1440)'    => '2K (2560x1440)',
			'1080i (1920x1080)' => '1080i (1920x1080)',
			'720i (1280x720)'   => '720i (1280x720)',
			'None'              => 'None',
		),
	),
	'Color'           => array(
		'id'              => 'images-color-options',
		'option_selected' => isset( $general_setting['image_generator']['color'] ) ? $general_setting['image_generator']['color'] : 'None',
		'option'          => array(
			'RGB'       => 'RGB',
			'CMYK'      => 'CMYK',
			'Grayscale' => 'Grayscale',
			'HEX'       => 'HEX',
			'CMY'       => 'CMY',
			'HSL'       => 'HSL',
			'HSV'       => 'HSV',
			'LAB'       => 'LAB',
			'LCH'       => 'LCH',
			'LUV'       => 'LUV',
			'XYZ'       => 'XYZ',
			'YUV'       => 'YUV',
			'YIQ'       => 'YIQ',
			'YCbCr'     => 'YCbCr',
			'YPbPr'     => 'YPbPr',
			'YDbDr'     => 'YDbDr',
			'YCoCg'     => 'YCoCg',
			'YCgCo'     => 'YCgCo',
			'YCC'       => 'YCC',
			'None'      => 'None',
		),
	),
	'Special effects' => array(
		'id'              => 'images-special-effects-options',
		'option_selected' => isset( $general_setting['image_generator']['special_effects'] ) ? $general_setting['image_generator']['special_effects'] : 'None',
		'option'          => array(
			'Cinemagraph'             => 'Cinemagraph',
			'3D'                      => '3D',
			'Add Noise'               => 'Add Noise',
			'Black and White'         => 'Black and White',
			'Blur'                    => 'Blur',
			'Bokeh'                   => 'Bokeh',
			'Brightness and Contrast' => 'Brightness and Contrast',
			'Camera Shake'            => 'Camera Shake',
			'Clarity'                 => 'Clarity',
			'Color Balance'           => 'Color Balance',
			'Color Pop'               => 'Color Pop',
			'Color Temperature'       => 'Color Temperature',
			'Cross Processing'        => 'Cross Processing',
			'Crop and Rotate'         => 'Crop and Rotate',
			'Dehaze'                  => 'Dehaze',
			'Denoise'                 => 'Denoise',
			'Diffuse Glow'            => 'Diffuse Glow',
			'Displace'                => 'Displace',
			'Distort'                 => 'Distort',
			'Double exposure'         => 'Double exposure',
			'Duotone'                 => 'Duotone',
			'Edge Detection'          => 'Edge Detection',
			'Emboss'                  => 'Emboss',
			'Exposure'                => 'Exposure',
			'Fish Eye'                => 'Fish Eye',
			'Flare'                   => 'Flare',
			'Flip'                    => 'Flip',
			'Fractalius'              => 'Fractalius',
			'Glowing Edges'           => 'Glowing Edges',
			'Gradient Map'            => 'Gradient Map',
			'Grayscale'               => 'Grayscale',
			'Halftone'                => 'Halftone',
			'HDR'                     => 'HDR',
			'HDR Look'                => 'HDR Look',
			'High Pass'               => 'High Pass',
			'Hue and Saturation'      => 'Hue and Saturation',
			'Impressionist'           => 'Impressionist',
			'Infrared'                => 'Infrared',
			'Invert'                  => 'Invert',
			'Lens Correction'         => 'Lens Correction',
			'Lens flare'              => 'Lens flare',
			'Lomo Effect'             => 'Lomo Effect',
			'Motion Blur'             => 'Motion Blur',
			'Night Vision'            => 'Night Vision',
			'Oil Painting'            => 'Oil Painting',
			'Old Photo'               => 'Old Photo',
			'Orton Effect'            => 'Orton Effect',
			'Panorama'                => 'Panorama',
			'Pinch'                   => 'Pinch',
			'Pixelate'                => 'Pixelate',
			'Polar Coordinates'       => 'Polar Coordinates',
			'Posterize'               => 'Posterize',
			'Radial Blur'             => 'Radial Blur',
			'Rain'                    => 'Rain',
			'Reflect'                 => 'Reflect',
			'Ripple'                  => 'Ripple',
			'Sharpen'                 => 'Sharpen',
			'Slow motion'             => 'Slow motion',
			'Stop-motion'             => 'Stop-motion',
			'Solarize'                => 'Solarize',
			'Starburst'               => 'Starburst',
			'Sunburst'                => 'Sunburst',
			'Timelapse'               => 'Timelapse',
			'Tilt-shift'              => 'Tilt-shift',
			'Vignette'                => 'Vignette',
			'Zoom blur'               => 'Zoom blur',
			'None'                    => 'None',
		),
	),
	'Size'            => array(
		'id'              => 'images-size-options',
		'option_selected' => isset( $general_setting['image_generator']['size'] ) ? $general_setting['image_generator']['size'] : '1024x1024',
		'option'          => array(
			'256x256'   => '256x256',
			'512x512'   => '512x512',
			'1024x1024' => '1024x1024',
		),
	),
);
?>
<div class="section settings-section">
	<div class="section-title"><?php echo esc_html__( 'Settings', 'aibuddy-openai-chatgpt' ); ?></div>
	<div class="section-content">
		<div class="section-field">
			<form class="image-settings-form">
				<?php
				foreach ( $dropdown_images as $label => $image_options ) :
					?>
					<div class="section-field">
						<div class="section-subtitle"><?php echo esc_html( $label ); ?></div>
						<select class="ai-buddy-select" id="<?php echo esc_attr( $image_options['id'] ); ?>">
						<?php
						foreach ( $image_options['option'] as $option_key => $option ) :
							$selected = '';
							if ( $option_key === $image_options['option_selected'] ) {
								$selected = ' selected';
							}
							?>
							<option value="<?php echo esc_html( $option ); ?>" <?php echo esc_attr( $selected ); ?>><?php echo esc_html( $option ); ?></option>
						<?php endforeach; ?>
						</select>
					</div>
					<?php
				endforeach;
				?>
			</form>
			<div class="section-button-box">
				<button type="button" class="ai-buddy-button save-images-settings"><?php echo esc_html__( 'Save Settings', 'aibuddy-openai-chatgpt' ); ?></button>
			</div>
			<div class="plugin-settings-request">
				<span class="successful-request"><span class="settings-request-icon aibuddy-solid-check"></span> <?php echo esc_html__( 'Changes successfully saved', 'aibuddy-openai-chatgpt' ); ?></span>
				<span class="error-request"><span class="settings-request-icon aibuddy-solid-cancel"></span> <?php echo esc_html__( 'Something went wrong', 'aibuddy-openai-chatgpt' ); ?></span>
			</div>
		</div>
	</div>
</div>
