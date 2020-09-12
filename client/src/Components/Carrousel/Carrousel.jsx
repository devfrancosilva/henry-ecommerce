import React from 'react'

export const Carrousel = () => {
  return (
    <div
      style={{ maxHeight: '400px' }}
      id='carouselExampleIndicators'
      className='carousel slide overflow-hidden'
      data-ride='carousel'
    >
      <ol className='carousel-indicators'>
        <li
          data-target='#carouselExampleIndicators'
          data-slide-to='0'
          className='active'
        ></li>
        <li data-target='#carouselExampleIndicators' data-slide-to='1'></li>
        <li data-target='#carouselExampleIndicators' data-slide-to='2'></li>
      </ol>
      <div className='carousel-inner'>
        <div className='carousel-item active'>
          <img
            src='https://imgur.com/zDavtaq.jpg'
            className='d-block w-100'
            style={{ maxHeight: '400px' }}
            alt='...'
          />
        </div>
        <div className='carousel-item'>
          <img
            src='https://computernetworkstore.com/wp-content/uploads/2020/01/banner_large_180803-1.png'
            className='d-block w-100'
            style={{ maxHeight: '400px' }}
            alt='...'
          />
        </div>
        <div className='carousel-item'>
          <img
            src='https://www.nvidia.com/content/dam/en-zz/Solutions/GEXT/gext-fb-og-csgo-dota2-1200x627.jpg'
            className='d-block w-100'
            style={{ maxHeight: '400px' }}
            alt='...'
          />
        </div>
      </div>
      <a
        className='carousel-control-prev'
        href='#carouselExampleIndicators'
        role='button'
        data-slide='prev'
      >
        <span className='carousel-control-prev-icon' aria-hidden='true'></span>
        <span className='sr-only'>Previous</span>
      </a>
      <a
        className='carousel-control-next'
        href='#carouselExampleIndicators'
        role='button'
        data-slide='next'
      >
        <span className='carousel-control-next-icon' aria-hidden='true'></span>
        <span className='sr-only'>Next</span>
      </a>
    </div>
  )
}
