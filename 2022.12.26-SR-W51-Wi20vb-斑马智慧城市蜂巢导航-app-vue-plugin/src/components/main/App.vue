<template>
  <div :id="id" ref="app-secondary" class="app-secondary ">
    <div class="smart_city">

      <div class="smart_city_head">
        <div class="smart_city_head_left"></div>
        <div class="smart_city_head_center">
          <!-- <img :src="titleSvg"> -->
          <svg width="717" height="62" viewBox="0 0 747 62" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_d_905_10575)">
              <path
                d="M35.2767 40.36L36.5167 31.56H34.9967L32.3167 45.32H26.8367L31.6367 20.36H41.8367L41.7567 17.92L40.6367 16.6H47.3567L47.4367 20.36H52.6367L52.0767 24.32H47.5567L47.7567 31.88L51.5167 28.8L50.6767 34.72L47.8767 37L47.9967 40.84H49.1167L50.8367 39.32L49.9567 45.32H42.6767L42.5167 41.36L40.2767 43.2L41.1167 37.28L42.3567 36.28L41.9567 24.32H36.3967L35.7167 27.76H41.8367L40.1967 39.4C40.09 40.1733 39.7567 40.8267 39.1967 41.36C38.6633 41.8667 38.01 42.12 37.2367 42.12H33.4767L35.2767 40.36ZM26.8367 42.4L16.6767 44.68L17.2767 40.24L19.5167 39.76L20.9567 29.44H18.7967L19.3567 25.48H21.5167L22.4767 18.84L21.4367 17.32H28.4767L27.3167 25.48H29.1967L28.6367 29.44H26.7567L25.5167 38.4L27.4367 37.96L26.8367 42.4ZM52.1967 19.8H48.0367L47.9967 17.24H52.1967V19.8ZM72.7535 29.48H68.9535L67.0335 43.16H59.4335L61.7535 26.8L60.7935 25.68H73.2735L73.5935 23.4H60.7135L61.2335 19.6H74.1135L74.3535 18.08L73.0735 16.56H82.1935L81.7535 19.6H94.6735L94.1535 23.4H81.1935L80.8735 25.68H92.3135L90.2335 40.44C90.1269 41.1867 89.7669 41.8267 89.1535 42.36C88.5669 42.8933 87.8869 43.16 87.1135 43.16H80.7535L82.5535 40.92L84.1535 29.48H80.3535L78.1135 45.36H70.5135L72.7535 29.48ZM102.51 44.68L104.59 40.72L106.47 27.2H104.95L105.51 23.4H113.87L111.63 39.24L117.11 40.88H135.71L135.19 44.68H113.91L109.95 43.52L109.35 44.68H102.51ZM133.31 31L134.43 39.36H128.35L128.19 38.32L113.95 39L114.43 35.56L118.11 28.72H114.63L115.15 24.92H136.43L135.91 28.72H125.71L122.23 35.2L127.75 34.96L127.23 31H133.31ZM135.99 17.36L135.47 21.12H117.23L117.75 17.36H135.99ZM112.43 17.32L114.07 21.88H107.99L106.35 17.32H112.43ZM178.427 26.12L177.867 30.08H172.347L170.587 42.68C170.481 43.4533 170.121 44.0933 169.507 44.6C168.894 45.08 168.214 45.32 167.467 45.32H159.547L163.147 41.6L164.747 30.08H157.707L158.267 26.12H178.427ZM155.827 27.2L153.267 45.36H146.027L148.387 28.56L145.267 29.12L145.907 24.56L156.467 22.64L155.827 27.2ZM178.467 17.36L177.907 21.28H160.067L160.627 17.36H178.467ZM156.707 21.12L146.107 23.04L146.747 18.48L157.347 16.56L156.707 21.12ZM216.264 31L215.424 37.08H196.384L196.224 38.2H216.024L214.984 45.36H187.624L189.664 31H186.624L187.464 24.92H199.784L199.624 23.84H208.464L208.624 24.92H220.904L220.064 31H216.264ZM213.624 18.08H221.864L221.464 21.12H217.624L218.864 23.4H212.784L211.664 21.4L210.504 23.4H203.664L207.024 17.6L206.144 16.56H214.504L213.624 18.08ZM197.624 18.08H205.144L204.744 21.12H201.624L202.904 23.4H196.824L195.704 21.4L194.544 23.4H187.704L191.064 17.6L190.184 16.56H198.544L197.624 18.08ZM194.384 29.84H212.624L212.784 28.72H194.544L194.384 29.84ZM195.784 41.24L195.624 42.4H207.824L207.984 41.24H195.784ZM196.984 32.88L196.824 34.04H208.224L208.384 32.88H196.984ZM248.781 34.76L249.101 32.44H242.461L244.581 17.28H264.661L262.541 32.44H255.181L254.861 34.76H262.141L261.581 38.56H254.341L254.021 40.84H262.141L261.621 44.64H239.901L240.421 40.84H247.941L248.261 38.56H241.501L242.061 34.76H248.781ZM233.141 27.64L234.101 20.84H232.181L232.661 17.28H243.221L242.741 20.84H240.421L239.461 27.64H241.901L241.301 31.68H238.901L237.861 39.24L240.181 38.8L239.661 42.68L228.621 44.64L229.141 40.84L231.341 40.44L232.581 31.68H230.501L231.101 27.64H233.141ZM248.181 23.04H250.461L250.741 20.88H248.501L248.181 23.04ZM257.981 28.8L258.261 26.64H256.021L255.701 28.8H257.981ZM256.821 20.88L256.541 23.04H258.741L259.061 20.88H256.821ZM249.621 28.8L249.941 26.64H247.701L247.421 28.8H249.621ZM305.538 30.24L303.538 44.68H283.898L285.898 30.24H305.538ZM277.178 21.24L277.698 17.72L276.738 16.56H284.538L283.858 21.24H285.978L285.458 25.04H283.338L282.658 29.88L284.858 29.32L284.258 33.52L282.098 34.08L280.898 42.6C280.791 43.3733 280.445 44.0133 279.858 44.52C279.298 45 278.631 45.24 277.858 45.24H271.258L274.338 41.64L275.138 35.76L272.538 36.4L273.098 32.24L275.738 31.6L276.658 25.04H274.138L274.658 21.24H277.178ZM306.338 21.32L293.938 22.72L293.618 25.04H304.978L306.698 23.52L305.978 28.76H286.218L287.738 17.84L286.378 16.64H294.778L294.498 18.68L306.858 17.44L306.338 21.32ZM298.538 35.92L298.858 33.8H291.858L291.538 35.92H298.538ZM297.698 41.16L297.978 39.16H291.218L290.938 41.16H297.698ZM327.495 31.04L329.735 27.52H327.415L327.975 23.72H332.175L333.135 22.24H338.815L337.895 23.72H349.135L348.575 27.52H335.535L333.095 31.44H335.615L336.055 28.4H342.975L342.535 31.44H348.015L347.535 34.84H342.055L341.695 37.24H347.335L346.815 40.96H341.175L340.575 45.36H333.655L334.255 40.96H324.615L325.135 37.24H334.775L335.135 34.84H326.935L327.495 31.04ZM318.815 21.68L319.375 17.72L318.415 16.56H325.935L325.215 21.68H327.135L326.575 25.48H324.655L324.055 29.84L326.055 29.32L325.455 33.52L323.455 34.04L322.255 42.72C322.121 43.4933 321.761 44.1333 321.175 44.64C320.615 45.12 319.948 45.36 319.175 45.36H312.855L315.975 41.76L316.815 35.8L314.495 36.4L315.095 32.24L317.375 31.64L318.255 25.48H316.015L316.575 21.68H318.815ZM344.375 21.12H332.855L332.575 22.88H327.735L328.535 17.32H350.055L349.255 22.88H344.095L344.375 21.12ZM391.452 17.32L387.892 42.72C387.785 43.4933 387.438 44.1333 386.852 44.64C386.265 45.12 385.585 45.36 384.812 45.36H379.052L382.572 41.68L385.452 21.04H374.012L370.012 45.36H364.212L368.772 18.76L367.532 17.32H391.452ZM356.212 45.24L358.612 28.28H356.532L357.092 24.36H365.292L363.172 39.28L364.612 38.72L364.052 42.84L356.212 45.24ZM383.252 32.08L382.052 40.68H371.852L373.052 32.08H383.252ZM376.092 27.8L376.332 26.12H373.972L374.412 23.08H376.772L376.972 21.6H382.092L381.892 23.08H384.292L383.852 26.12H381.452L381.212 27.8H383.972L383.532 30.84H372.972L373.412 27.8H376.092ZM364.492 17.32L365.372 22.84H359.692L358.812 17.32H364.492ZM378.332 38.12L378.812 34.68H376.772L376.292 38.12H378.332ZM416.169 18.84L416.289 18.08L415.009 16.56H424.129L423.809 18.84H434.449L433.889 22.64H409.369L404.849 45.36H398.009L403.009 20.28L401.769 18.84H416.169ZM413.969 40.84L408.329 37.08L408.409 36.32L408.889 32.92H431.689L431.129 37.08L424.369 40.84L431.449 45.36H420.809L418.729 44L416.249 45.36H405.609L413.969 40.84ZM432.289 23.4L432.129 24.52H433.649L433.209 27.56H431.689L431.089 31.76H409.809L410.409 27.56H408.889L409.329 24.52H410.849L411.009 23.4H418.609L418.449 24.52H424.529L424.689 23.4H432.289ZM423.929 28.72L424.089 27.56H418.009L417.849 28.72H423.929ZM417.289 36.32L419.609 37.8L422.329 36.32H417.289ZM475.805 17.32L475.285 21.12H463.845L462.485 31H475.405L474.885 34.8H461.965L460.485 45.36H452.885L454.365 34.8H441.445L441.965 31H454.885L456.245 21.12H444.885L445.405 17.32H475.805ZM466.725 22.64H473.565L471.085 29.48H464.245L466.725 22.64ZM453.605 29.48H446.765L446.205 22.64H453.045L453.605 29.48ZM516.402 31L514.482 44.56H485.082L487.002 31H516.402ZM514.162 18.12L517.002 29.48H510.522L510.362 28.88H487.202L487.602 26L493.362 17.52L492.402 16.6H502.282L496.282 25.2H509.442L507.682 18.12H514.162ZM507.482 40.76L508.322 34.76H493.922L493.082 40.76H507.482ZM561.319 17.32L560.799 21.2H554.319L553.639 22.92H559.879L557.839 37.36H554.039L553.359 36.4L554.759 26.48H547.719L546.319 36.4L545.399 37.36H541.559L543.599 22.92H548.559L549.239 21.2H543.399L543.919 17.32H561.319ZM531.359 36.4L532.199 37.88L534.559 33.52H525.759L526.279 29.8H541.359L540.759 34.04L535.359 42.36H535.279L537.079 45.28H530.839L525.519 36.4H531.359ZM537.279 28.6H532.439L531.919 25.64L530.879 28.16H526.119L530.199 18.44L529.239 17.36H541.159L542.599 28.12H538.239L537.079 20.88H533.919L532.439 24.36H536.559L537.279 28.6ZM553.359 27.88L552.199 36.24L557.519 45.28H551.239L549.359 40.28L545.799 45.28H539.879L547.559 36.08L548.719 27.88H553.359ZM573.476 18.8L572.196 17.32H602.556L601.396 25.64H580.116L579.916 27.2H601.196L602.916 25.68L602.156 31H596.076L595.876 32.52H602.716L602.196 36.32H595.316L594.436 42.72C594.329 43.4933 593.983 44.1333 593.396 44.64C592.809 45.12 592.129 45.36 591.356 45.36H583.436L586.996 41.64L587.716 36.32H568.756L569.276 32.52H588.276L588.476 31H571.756L573.476 18.8ZM582.316 42.4H574.716L573.876 37.48H581.476L582.316 42.4ZM580.756 21.12L580.596 22.24H594.276L594.436 21.12H580.756ZM612.873 37.12L615.313 32.16H622.193L621.473 33.84H632.473L633.993 31.28H612.513L612.953 28.08H642.113L641.673 31.28L640.113 33.84H643.593L642.353 42.68C642.246 43.4533 641.886 44.0933 641.273 44.6C640.686 45.08 640.006 45.32 639.233 45.32H624.473L627.953 42.4H634.793L635.513 37.12H612.873ZM645.833 17.36L644.433 27.16H630.113L631.513 17.36H645.833ZM615.713 21.24H613.473L613.913 18.12H617.313L617.393 17.96L616.233 16.6H624.113L623.353 18.12H629.993L629.113 24.48C628.98 25.2533 628.62 25.9067 628.033 26.44C627.446 26.9467 626.766 27.2 625.993 27.2H620.993L623.553 24.68L624.033 21.24H621.833L618.953 27.2H612.673L615.713 21.24ZM633.913 38.08L633.433 41.44H610.593L611.073 38.08H633.913ZM639.913 23.96L640.393 20.56H636.073L635.593 23.96H639.913ZM653.67 32.8L656.79 22.56H661.35L659.47 29H661.27L663.79 21.08H655.79L656.31 17.28H669.35L668.83 21.08L666.39 29H667.79L667.07 34.04H672.99L673.91 35.08L675.55 32.52H668.59L670.27 20.36H676.83L677.15 18.04L675.91 16.56H683.03L682.47 20.36H688.55L686.87 32.52H681.03L677.27 37.84L680.31 40.88H685.59L684.95 45.36H677.35L674.27 42.08L671.91 45.36H665.95L670.99 38.56L667.03 34.32L665.87 42.68C665.763 43.4533 665.403 44.0933 664.79 44.6C664.176 45.08 663.496 45.32 662.75 45.32H654.87L658.55 41.44H660.67L661.71 32.8H653.67ZM660.39 34.56L659.87 38.44L652.67 39.24L653.23 35.36L660.39 34.56ZM673.91 28.72H675.83L676.47 24.16H674.55L673.91 28.72ZM681.39 24.16L680.75 28.72H682.59L683.23 24.16H681.39ZM697.147 32.92H696.507L697.067 29H697.827L699.547 18.76H702.587L702.987 17.92L702.307 16.6H708.747L707.787 18.76H712.907L711.467 29H712.387L711.827 32.92H710.907L709.347 43.92C709.293 44.3733 709.12 44.72 708.827 44.96C708.56 45.1733 708.253 45.28 707.907 45.28H702.227L704.827 42.52L706.187 32.92H701.827L699.707 45.28H695.107L697.147 32.92ZM711.187 44.6L713.667 26.92H730.027L728.947 34.68C728.84 35.4267 728.52 36.0133 727.987 36.44C727.48 36.8667 726.853 37.08 726.107 37.08H720.987L723.267 34.36L723.787 30.68H718.867L717.467 40.48H727.067L729.107 38.6L728.267 44.6H711.187ZM716.827 17.72L715.987 16.56H728.627L730.907 26H724.627L723.307 20.36H721.547L718.787 26.04H712.707L716.827 17.72ZM702.507 29H706.747L707.707 22.24H703.667L702.507 29ZM701.907 34H705.067L704.787 40.12H701.507L701.907 34ZM703.627 23.36H706.787L706.667 27.96H703.387L703.627 23.36Z"
                fill="white" />
            </g>
            <defs>
              <filter id="filter0_d_905_10575" x="0.676758" y="0.55957" width="746.23" height="60.8008"
                filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha" />
                <feOffset />
                <feGaussianBlur stdDeviation="8" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.2 0 0 0 0 0.733334 0 0 0 0 1 0 0 0 0.5 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_905_10575" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_905_10575" result="shape" />
              </filter>
            </defs>
          </svg>

        </div>
        <div class="smart_city_head_right">
          <div class="head_right_time">
            <div class="head_right_date">{{ moment(nowDate).format('HH:mm:ss') }}</div>
            <div class="head_right_year">
              <div class="head_right_month">{{ moment(nowDate).format('YYYY/MM/DD') }}</div>
              <div class="head_right_zhou">周{{ datE[moment(nowDate).format('E') - 1] }}</div>
            </div>
          </div>

        </div>
      </div>

      <div class="left_button">
        <div class="left_row" v-for="o in 6" :key="o">
          <template v-if="o == 1">
            <div
              :class="{ left_item: true, left_item_hover: Boolean(buttonLeft[(o - 1) * 3 + (i - 1)]?.application_name) }"
              v-for="i in 2" @click="testClickFn(buttonLeft[(i - 1)])" :style="{ backgroundImage: `url(${imgArr[0]})` }"
              :key="i">
              <img class="title_left"
                :src="JSON.parse(buttonLeft[(o - 1) * 2 + (i - 1)]?.application_picture || '[{}]')[0]?.url" alt=""
                srcset="">
              {{ buttonLeft[(o - 1) * 2 + (i -
                  1)]?.application_name
              }}
            </div>
          </template>

          <template v-else-if="o > 1 && o <= 5">
            <div
              :class="{ left_item: true, left_item_hover: Boolean(buttonLeft[(o - 1) * 3 + (i - 2)]?.application_name) }"
              v-for="i in 3" @click="testClickFn(buttonLeft[indexButtnLeft(o, i)])"
              :style="{ backgroundImage: `url(${buttonLeft[indexButtnLeft(o, i)]?.application_name ? imgArr[buttonLeft[(o - 1) * 3 + (i - 2)]?.color || 0] : imgArr[2]})` }"
              :key="i">
              <img v-if="buttonLeft[indexButtnLeft(o, i)]?.application_name" class="title_left"
                :src="JSON.parse(buttonLeft[indexButtnLeft(o, i)]?.application_picture || '[{}]')[0]?.url" srcset="">
              {{ buttonLeft[indexButtnLeft(o, i)]?.application_name
              }}
            </div>
          </template>
          <div class="left_item" v-else :style="{ backgroundImage: `url(${imgArr[2]})` }" key="i">

          </div>
        </div>
      </div>

      <div class="right_button">
        <div class="left_row" v-for="o in 6" :key="o">
          <template v-if="o == 1">
            <div
              :class="{ left_item: true, right_item: true, left_item_hover: Boolean(buttonRIight[(o - 1) * 2 + (i - 1)]?.application_name) }"
              v-for="i in 2" @click="testClickFn(buttonRIight[(i - 1)])"
              :style="{ backgroundImage: `url(${buttonRIight[(o - 1) * 2 + (i - 1)]?.application_name ? imgArr[buttonRIight[(o - 1) * 2 + (i - 1)]?.color || 0] : imgArr[2]})` }"
              :key="i">
              <div :class="{
                title_tes: buttonRIight[(o - 1) * 2 + (i -
                  1)]?.application_name?.length == 4
              }">
                {{ buttonRIight[(o - 1) * 2 + (i -
                    1)]?.application_name
                }}
              </div>

            </div>
          </template>

          <template v-else-if="o > 1 && o <= 5">
            <div
              :class="{ left_item: true, right_item: true, left_item_hover: Boolean(buttonRIight[(o - 1) * 3 + (i - 2)]?.application_name) }"
              v-for="i in 3" @click="testClickFn(buttonRIight[indexButtnLeft(o, i)])"
              :style="{ backgroundImage: `url(${buttonRIight[indexButtnLeft(o, i)]?.application_name ? imgArr[buttonRIight[(o - 1) * 3 + (i - 2)]?.color || 0] : imgArr[2]})` }"
              :key="i">
              <!-- <img v-if="buttonRIight[indexButtnLeft(o, i)]?.application_name"
                :class="{ title_left: true, title_right: true, title_tes: buttonRIight[indexButtnLeft(o, i)]?.application_name?.length == 3 && buttonRIight[indexButtnLeft(o, i)]?.application_name != '灯塔乡' }"
                :src="JSON.parse(buttonRIight[indexButtnLeft(o, i)]?.application_picture || '[{}]')[0]?.url" alt=""
                srcset=""> -->
              <div :class="{ title_tes: buttonRIight[indexButtnLeft(o, i)]?.application_name?.length == 4 }">
                {{ buttonRIight[indexButtnLeft(o, i)]?.application_name
                }}
              </div>

            </div>
          </template>
          <div class="left_item" v-else :style="{ backgroundImage: `url(${imgArr[2]})` }" key="i">

          </div>
        </div>
      </div>

      <div class="left_title public_title">
        <!-- 智慧园区 -->
        <svg width="34" height="164" viewBox="0 0 34 164" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3.71741 14.156H29.2414L27.5854 25.892H2.06141L3.71741 14.156ZM9.33341 1.736H18.9094L18.3694 5.408H13.6174L13.5094 6.128H18.3334L17.8654 9.512H15.4894L17.7574 13.4H11.6014L10.0894 10.844L7.92941 13.436H1.34141L5.15741 9.512H1.44941L1.91741 6.128H7.82141L7.92941 5.408H6.88541L6.77741 5.588H1.91741L4.97741 0.907999L4.04141 0.403999H10.2334L9.33341 1.736ZM19.6654 1.34H32.6254L30.9334 13.292H17.9734L19.6654 1.34ZM9.36941 18.692H22.5814L22.7974 17.252H9.58541L9.36941 18.692ZM22.0054 22.76L22.1854 21.464H8.97341L8.79341 22.76H22.0054ZM26.3614 9.944L27.0454 4.868H24.5614L23.8774 9.944H26.3614ZM24.5974 59.652L24.7414 58.752H4.29341L4.61741 56.484H31.5094L30.2854 65.16H3.21341L3.53741 62.784H24.1654L24.3094 61.776H4.43741L4.72541 59.652H24.5974ZM9.04541 47.52V47.484L7.85741 46.224H15.1654L14.9854 47.52H18.4774L18.1534 49.644H14.6614L14.5534 50.4H18.0454L17.7934 52.38H14.3014L14.1934 53.136H17.6854L17.3614 55.26H13.9054L13.7974 55.98H7.85741L7.96541 55.26H4.04141L4.36541 53.136H8.25341L8.36141 52.38H4.47341L4.72541 50.4H8.61341L8.72141 49.644H4.83341L5.15741 47.52H9.04541ZM23.7694 47.52V47.484L22.5454 46.224H29.8894L29.7094 47.52H33.1654L32.8414 49.644H29.3854L29.2774 50.4H32.7334L32.4814 52.38H29.0254L28.9174 53.136H32.3734L32.0494 55.26H28.6294L28.5214 55.98H22.5814L22.6894 55.26H18.7654L19.0894 53.136H22.9774L23.0854 52.38H19.1974L19.4494 50.4H23.3374L23.4454 49.644H19.5574L19.8814 47.52H23.7694ZM8.32541 71.712L9.11741 66.06H15.2734L14.8774 69.084H22.6894L24.1654 68.184L23.6614 71.712H8.32541ZM24.7414 66.24H30.3214L30.7894 71.676H25.2094L24.7414 66.24ZM6.27341 71.676H0.801406L2.88941 66.492H8.36141L6.27341 71.676ZM16.4974 65.916H22.2574L22.5094 68.364H16.7494L16.4974 65.916ZM28.9534 117.712H1.59341L4.86941 94.42L3.71741 93.088H32.4094L28.9534 117.712ZM23.9494 114.292L26.4694 96.508H10.0534L7.53341 114.292H23.9494ZM17.4694 113.428C17.0614 113.428 16.7374 113.224 16.4974 112.816C16.2814 112.384 16.2334 111.772 16.3534 110.98L17.1094 105.544H16.1374L13.4734 113.428H8.57741L11.3494 105.544H9.33341L9.83741 101.944H24.9934L24.4894 105.544H21.8254L21.1414 110.368H22.7974L23.8774 109.504L23.3374 113.428H17.4694ZM24.9214 97.192L24.3814 100.792H10.7734L11.3134 97.192H24.9214ZM2.38541 163.676L5.62541 140.6L4.18541 139.052H31.6174L31.1494 142.328H11.5654L9.04541 160.364H29.7094L29.2414 163.676H2.38541ZM20.7814 147.188L23.9854 143.84H29.9254L23.4454 150.572L23.3374 150.608L28.7374 158.888H22.7974L20.0614 154.244L16.8214 158.888H10.8454L17.3614 150.86L17.2174 150.788L12.8974 143.732H18.8374L20.7814 147.188Z"
            fill="white" />
        </svg>
      </div>
      <div class="right_title public_title">
        <!-- 数字乡村 -->
        <svg width="34" height="165" viewBox="0 0 34 165" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M23.7694 22.292L20.9974 26.324H9.36941L8.46941 25.496L7.31741 26.324H0.477406L5.40941 22.724L2.70941 20.24L3.17741 16.82H1.84541L2.31341 13.4H3.64541L3.82541 12.248H8.61341L8.43341 13.4H11.8534L12.0334 12.248H16.8214L16.6414 13.4H18.0454L17.5774 16.82H16.1734L15.7054 20.24L12.2854 22.724L15.7774 25.964L21.4654 17.684L18.3334 11.348H23.8054L24.6694 13.076L25.8574 11.348V11.312L26.5054 6.56H25.2094L23.9854 9.98H18.5134L21.6094 1.232L20.9254 0.403999H27.4054L26.4334 3.14H33.4894L33.0214 6.56H31.9774L31.3294 11.312L26.9374 17.684L31.2574 26.324H25.7854L23.7694 22.292ZM5.12141 7.928H3.06941L3.57341 4.508H9.04541L9.44141 1.736L8.82941 0.403999H14.4094L13.8334 4.508H19.3054L18.8014 7.928H16.5694L18.2254 12.032H14.1214L13.1134 9.548L12.7534 12.032H7.96541L8.36141 9.296L6.59741 12.032H2.49341L5.12141 7.928ZM15.6694 1.088H19.7734L18.6934 3.824H14.5894L15.6694 1.088ZM8.43341 3.824H4.32941L4.04141 1.088H8.14541L8.43341 3.824ZM11.1694 18.548L11.3854 16.82H7.96541L7.74941 18.548L9.26141 19.952L11.1694 18.548ZM13.1854 61.884L13.4014 60.48L21.3574 58.032H5.51741L6.02141 54.54H29.9614L29.3854 58.716L20.0254 61.884H31.6534L31.1854 65.376H19.5214L18.9094 69.876C18.8134 70.572 18.4894 71.16 17.9374 71.64C17.4094 72.096 16.7974 72.324 16.1014 72.324H9.00941L12.2134 68.94L12.7174 65.376H1.08941L1.55741 61.884H13.1854ZM24.8494 51.876H11.1694L10.9174 53.82H3.39341L4.14941 48.456H15.0574L15.1654 47.736L14.0494 46.404H22.7614L22.4374 48.456H32.8774L32.1214 53.82H24.5974L24.8494 51.876ZM5.94941 108.244L11.9614 103.744H6.12941L6.56141 100.792L14.9854 92.404H21.9694L13.7974 100.576H16.1014L20.7094 96.148H28.3414L16.3894 107.272H22.1494L25.1734 100.972H31.8334L24.6694 117.784H2.16941L2.67341 114.22H18.8374L20.5294 110.656H5.62541L5.94941 108.244ZM19.9534 164.324L23.2294 161.012L25.2814 146.432H17.4334L17.9374 143.048H25.7854L26.2894 139.412L25.3174 138.404H32.3014L31.6534 143.048H33.4174L32.9134 146.432H31.1494L28.9894 161.948C28.8934 162.62 28.5694 163.184 28.0174 163.64C27.4894 164.096 26.8774 164.324 26.1814 164.324H19.9534ZM6.66941 146.216H2.99741L3.46541 142.94H7.13741L7.64141 139.484L6.77741 138.44H13.6534L13.0054 142.94H16.7854L16.3174 146.216H12.5374L9.98141 164.36H4.11341L6.66941 146.216ZM0.585406 163.316L3.53741 147.296H6.02141L3.10541 163.316H0.585406ZM21.3574 157.556H17.2174L17.1094 148.484H21.2494L21.3574 157.556ZM11.4574 160.94L12.7174 147.296H15.2014L13.9774 160.94H11.4574Z"
            fill="white" />
        </svg>
      </div>
      <!-- 
      <div class="left_line"></div>
      <div class="right_line"></div> -->
    </div>


    <div class="round_center"></div>
    <div class="logo_two"></div>
    <div class="title_two"></div>
  </div>
</template>

<script>
import { queryCards } from '../../api/asset'
import Polygon1 from '../../api/image/Polygon1.png'
import Polygon2 from '../../api/image/Polygon2.png'
import Polygon3 from '../../api/image/Polygon3.png'
import Polygon4 from '../../api/image/Polygon4.png'
import head_title from '../../api/image/head_title.svg'

export default {
  name: "Main",
  props: {
    customConfig: Object,
    info: Object,
    //应用变量和系统变量 2022.7.26 V8R4C50SPC220需求新加 之前版本取不到appVariables和sysVariables
    appVariables: Array,
    sysVariables: Array,
    //2022.8.11 V8R4C60SPC100需求新加，之前版本取不到themeInfo
    themeInfo: Object,
    //2022.10新加，之前取不到国际化方法
    intlGetKey: Function,
    history: Object,
    mainInit: Function
  },
  computed: {

  },
  data() {
    return {
      //必需，不可删除
      id: "",
      titleSvg: head_title,
      imgArr: [
        Polygon1,
        Polygon2,
        Polygon3,
        Polygon4,
      ],
      datE: ['一', '二', '三', '四', '五', '六', '日'],
      buttonLeft: [],
      buttonRIight: [],
      buttonArr: [],
      api: {
        application_name: '', //卡片名称
        application_picture: '',//卡片图片
        application_url: '',//跳转地址
        application_office_id: '',//点击权限
      },
      onlyT: null,
      nowDate: new Date()
    };
  },
  mounted() {
    //此方法封装了事件注册，不可删除
    this.mainInit(this);
    this.queryCards()
    this.onlyT = setInterval(() => {
      this.nowDate = new Date()
    }, 1000)
  },
  methods: {
    testClickFn(i) {
      if (i) {
        // this.history && this.history.push(i.application_url)
        i.auth && window, open(i.application_url)
        // i.auth && this.history && this.history.push(i.application_url)
      }


    },

    //接口请求
    queryCards() {
      queryCards().then(res => {

        this.buttonArr = res.data
        this.buttonArr.forEach((x, i) => {
          if (x.type == 1) this.buttonLeft.push(x)
          if (x.type == 2) this.buttonRIight.push(x)
        })
        if (this.buttonLeft.length < 14) {
          this.buttonLeft.splice(10, 0, {})
        }
        [2, 4, 5, 6, 11].forEach(x => {
          if (this.buttonLeft[x]) this.buttonLeft[x].color = 1

        })
        if (this.buttonRIight.length < 14) {
          this.buttonRIight.splice(0, 0, {})
          this.buttonRIight.splice(3, 0, {})
          this.buttonRIight.splice(8, 0, {})
        }
        [1, 2, 6, 7, 9, 12].forEach(x => {
          if (this.buttonRIight[x]) this.buttonRIight[x].color = 1

        })

        console.log(this.buttonRIight);
      }).catch(err => {
        console.log(err);
      })
    },
    indexButtnLeft(o, i) {
      return (o - 1) * 3 + (i - 2)
    },

    /**
     * 封装的触发事件方法 必需，不可删除
     * @param {String} eventName 事件名
     * @param {Object} payload 事件传参
     *
     */
    triggerEvent(eventName, payload) {
      let { componentId, appId } = this.customConfig || {};
      componentId && appId && window.eventCenter?.triggerEvent(
        componentId,
        eventName,
        payload
      );
    },
    //必需，不可删除
    Event_Center_getName() {
      return this.id;
    }
  },
  beforeDestroy() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
    clearInterval(this.onlyT)
    this.onlyT = null
  }
};
</script>
<style lang="less" scoped>
.app-secondary {
  position: relative;
  height: 1080px;

  .round_center {
    background: url('../../api/image/center2.png');
    position: absolute;
    // width: 100%;
    width: 1920px;
    height: 100%;
    left: 0px;
    top: 00px;
    z-index: 1;
  }

  .logo_two {
    background: url('../../api/image/logo.png') no-repeat;
    position: absolute;
    width: 460px;
    height: 273px;
    left: 734px;
    top: 400px;
    z-index: 2;
  }

  .title_two {
    background: url('../../api/image/中间切图.png') no-repeat;
    position: absolute;
    width: 1074px;
    height: 994px;
    left: 423px;
    top: 37px;
  }

}

.smart_city {
  // height: 100%;
  width: 100%;
  height: 1080px;
  background: url('../../api/image/base_ drawing.png') 100% 100%;

  position: relative;

  background-size: cover;
  // z-index: 66;

  .smart_city_head {
    // display: flex;
    position: relative;
    height: 75px;
    background: url('../../api/image/titleHead.png');
    background-size: cover;

    .smart_city_head_left {
      // background: url('../../api/image/head_left.png') 100% 100%;
      // width: 589px;
      height: 74px;
      background-size: cover;
      position: absolute;
      left: 0;
      top: 1px;
    }

    .smart_city_head_center {
      // background: url('../../../pluginTemp/images/head_title.svg');
      width: 717px;
      height: 75px;
      position: absolute;
      left: 50%;
      transform: translate(-50%, 0);
      background-size: contain;
      text-align: center;
      font-family: 'YouSheBiaoTiHei';
      font-style: normal;
      font-weight: 400;
      font-size: 40px;
      line-height: 52px;
      /* identical to box height */

      text-align: center;
      letter-spacing: 0.14em;

      color: #FFFFFF;

      text-shadow: 0px 0px 16px rgba(51, 187, 255, 0.5);
    }

    .smart_city_head_right {
      // background: url('../../api/image/head_right.png') 100% 100%;
      // width: 600px;
      height: 74px;
      // position: absolute;
      // left: 1308px;
      // top: 1px;
      background-size: cover;
      display: flex;
      justify-content: flex-end;

      .head_right_time {
        margin-right: 24px;
        margin-top: 21px;
        width: 108px;
        color: #94BCD5;

        .head_right_date {
          font-family: 'DIN';
          font-style: normal;
          font-weight: 700;
          font-size: 24px;
          line-height: 24px;
          /* identical to box height, or 100% */

          // text-align: right;
          letter-spacing: 1px;
        }

        .head_right_year {
          display: flex;
          justify-content: space-between;

          .head_right_month {
            font-family: 'DIN';
            font-style: normal;
            font-weight: 400;
            font-size: 12px;
            line-height: 18px;
          }

          .head_right_zhou {
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 400;
            font-size: 12px;
            line-height: 18px;
          }
        }
      }
    }
  }

  .left_button {
    position: absolute;
    width: 468px;
    height: 624px;
    left: 61px;
    top: 269px;
    z-index: 9999;

    .left_row {
      display: flex;
    }

    .left_row:nth-of-type(2n) {
      margin-left: 57px;
      margin-top: -34px;
    }

    .left_row:nth-of-type(2n+1) {
      margin-left: 0px;
      margin-top: -34px
    }



    .left_row:nth-of-type(1) {
      margin-left: 114px;
      margin-top: 0px
    }

    .left_row:nth-of-type(5) {
      margin-left: 114px;
      margin-top: -34px
    }

    .left_row:nth-of-type(6) {
      margin-left: 171px;
      margin-top: -34px
    }


    .left_item {
      width: 115px;
      height: 133px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      padding: 0 10px;

      font-family: 'PingFang SC';
      font-style: normal;
      // font-weight: 600;
      font-size: 16px;
      line-height: 26px;
      color: rgba(255, 255, 255, 0.8);
      text-align: center;
      // line-height: 133px;
      // background: red;
      background-repeat: no-repeat;
      clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
      // clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)  0px 104px, 116px 104px;
    }
  }

  .right_button {
    position: absolute;
    width: 468px;
    height: 624px;
    left: 1384px;
    top: 269px;
    z-index: 9999;

    .left_row {
      display: flex;
    }

    .left_row:nth-of-type(2n) {
      margin-left: 57px;
      margin-top: -34px;
    }

    .left_row:nth-of-type(2n+1) {
      margin-left: 0px;
      margin-top: -34px
    }

    .left_row:nth-of-type(3) {
      margin-left: 114px;
      margin-top: -34px
    }

    .left_row:nth-of-type(1) {
      margin-left: 114px;
      margin-top: 0px
    }

    .left_row:nth-of-type(5) {
      margin-left: 0px;
      margin-top: -34px
    }

    .left_row:nth-of-type(6) {
      margin-left: 171px;
      margin-top: -34px
    }


    .left_item {
      width: 115px;
      height: 133px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      padding: 0 10px;

      text-align: center;
      // line-height: 133px;
      // background: red;
      background-repeat: no-repeat;
      clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
      // clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)  0px 104px, 116px 104px;
    }

    .right_item {
      font-family: '优设标题';
      font-size: 32px;
      color: #FFFFFF;
    }

    .title_right {
      min-width: 59px;

      min-height: 22px;
    }

    .title_tes {
      width: 77px;
    }
  }



  .left_item_hover {
    cursor: pointer;

    &:hover {
      background-image: url('../../api/image/Polygon4.png') !important;
    }

  }

  .title_left {
    width: 36px;
    min-height: 36px;
  }

  .public_title {
    position: absolute;
    width: 32px;
    height: 184px;
    // left: 926px;
    // top: 405px;

    font-family: 'YouSheBiaoTiHei';
    font-style: normal;
    font-weight: 400;
    font-size: 36px;
    line-height: 46px;
    /* or 128% */
    z-index: 3;
    text-align: center;

    color: #FFFFFF;
  }

  .left_title {
    left: 520px;
    top: 440px;
  }

  .right_title {
    left: 1363px;
    top: 440px;

  }

  .left_line {
    background: url('../../api/image/line_left.png');
    position: absolute;

    left: -9px;
    top: 202px;
    width: 543px;
    height: 675px;
    z-index: 0;
  }

  .right_line {
    background: url('../../api/image/line_right.png');
    position: absolute;

    right: 10px;
    top: 202px;
    width: 650px;
    height: 675px;
    z-index: 0;
  }


  .testItem {
    width: 116px;
    background: red;
    height: 133px;
    background-repeat: no-repeat;
    clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
  }
}

@font-face {
  font-family: '优设标题';
  src: url('../../api/image/优设标题黑.ttf') format('truetype');
}
</style>
