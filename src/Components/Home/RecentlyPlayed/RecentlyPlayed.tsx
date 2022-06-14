import './RecentlyPlayed.css'
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';

const mock_data = [[
    {
        title : "Resolve",
        cover : 'data:image/jpeg;base64,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'
    },
    {
        title : 'Mila - Hello 2',
        cover : 'https://ih1.redbubble.net/image.662971630.2143/flat,800x800,075,f.u1.jpg',
    },
    {
        title : "YeYee - Busted 3",
        cover : 'https://www.mixtapecovers.net/wp-content/uploads/2021/06/The-Game-Chose-Me.jpg'
    },
    {
        title : 'Mila - Hello 4',
        cover : 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBUWFRgVFRUYGBgYGhoaGBgYGhgaGhkeGhgZHBwYHBgcIS4lHB4rIRoaJjgmKy8xNTU1HCQ7QDszPy40NTEBDAwMEA8QHhISGjQhISE0NDQ0NDQ0NDQ0MTE0NDQ0NDQ0NDQ0MTQ0NDQ0NDQxNDQ0NjQ0NDQ0MTQ0NDQ0NDQ0NP/AABEIAOEA4QMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAACAwABBAUGB//EAD0QAAEDAwEFBQcCAwgDAQAAAAEAAhEDEiExBAVBUWETInGBkQYyobHB0fBC8WJy4RQjUnOCkrK0MzTEJP/EABgBAQEBAQEAAAAAAAAAAAAAAAABAgME/8QAHxEBAQEBAQEAAwEBAQAAAAAAAAERAhIhAzFBIlET/9oADAMBAAIRAxEAPwD5jGQ4E3TOOGTodZ09VbW/n0TTTRdkcmDA1PAea9keSlFip1NbaDbTOfAGJBBDmlwMjGI6p23bY+q2m18f3bAxkNa3uiSJgZOTkrX8ZcstOv7g9ELgTqePGYEnJgfQLYyjP59UzadktMCDie7nhPDkNeUFZz+tSuXYiczkIWt1GS0NGTiNck4AEeHNVU2ctcWPBa5pLXA6gtMEHqCFGmazUxHGM8Y09ZVQRpjwWgsEYM5P0z8/RCWZgoFwJ0AiYGYOZg5np6eKjGA646/mpTbOXmnUKYuF2k5+qT7Uvxj7NMg/T1nn4rqb5p0BUI2dznU8Wl4AdoJkNxrKyHZnWXx3brZkZMTDRPejiRMS2YuE2zKkuxlIVimdIzppKYKabTYCe8SBkzngD01JEeeY1VGQMjIULenn+YWt9OPEH0Mn7JdvDhrCgzBmRjip2Wq19nxhXamGsbWHAz0H2RhusjPy8lpZSJBIBIGpAJA11PBRrMzCSFpDac4GZPLPJWylP5yHXj91sZTJkXAQDrPD9AxqeA0VOBB0tIweHSCFrGdZgwfPkrY37+BThTk4/r1TmbKbbo7t0F3CSJjnMStRKQ1hEGNdOo0PjoR5KnU8J5Yr4RA8czicDoZ+AW2CJPJv+xn2UTbFFFVarDTw048scwmBie1ozjEGCf6cfuuMdazQTw+qJ7QdBGAOJnr8k5tMjPj01wfmqtVZA5kHSM5GQRB0zp/VLenFihYg6GxuqDZmWbSaA7etMPrsv/utmj/xNMxnWNfFXusbQaNd9N1W+o+kA5j3mq+C8uBLXXnEa/GFjJljKce7UqPknHfbSaB5dmc9U6m8sa9gy41KZD2uwDTc8gtIzknBELF5rp6Or03l+yiqS6sKhLy4y/s76XZ9oTm6e1i7NsdEnfr6hc8P2l1ZpqPIZ2ldzWQ8xLXtDQQCRiYz5tO1N7Rj3Uu8DLw0hrXPBBa8NA7rpyRoSJxJADbBRfe5jaoc5xd33MLRc6ThrQePPkpOfq+vh28qlQU6QbtLms/s9JvYNfXF1wIMta2wg8ZOQCuHZC7VV9F4YXsrXMpspkscy3uCJy0niuaKa1JidXXTNaoyhQLNqdTApVCKTam0NLz/AGmvkCmLZIgSSPdzhZty7I973PDH1RRaahY0PeXvkBjSACTc8tu/ha48Eqs+4UxHuUyzXUmrUfPh3wPJXUeOzbTaIF5qPJ/W6LWD+VoL/N5Uy4b+tM33sLmvFR7HM7ZvaFj2lha+62q0NdmL5cMe69qXvtv9+/8Ako/9ekipPb2bqbgYvD2Fsd10Wu11DmxPVjeS3F+z1agc5tVrnCm09+mGAsYxk5bIHdnKSXZC2Za521N//PQH8e0f/Oq2UHsNpH8FP/s0l1duGzNDaRvf2bnw+k5oa/tLJMPbOLI4LEHsDajWNda8MAvLS4WVGPMwAD7hHmFbL+iWftqr0W1WUKVoZUFFppu0vmrVBpOJ4mJYTxJb+oQujsoqDY6b5AdUrhwHdMB9O4AcHQCPFZq/fsgRZSDMuAmHvdInX34gZwtG17xe/sXe6+kXG8avcSwh5/jFgk8ddSVnzTYRs+37VVcDSdVEC5tLZy8NY3gGsZwEgFxEniSUivTfe41GkPJl7SywgkTlgAt56DVbXnZ3y51OownJZTLOzk62l4ljenfjwwh2kufUe9zAwkjuD9Ia0MDSTmQGCZAzwC6cT7+mOr8/bEymnVdjfax7mkNfda8zDoOfQ6+K1GhieeRnMSfsgNInHpOi7eXH19YGU0VmFpNNXYYg6BTGtZgwEjEc445+f2VvYATEkcJ1g8+qd2cafkhCWnynSUpCLfyVFotbyPqPsopqhZRxp+fkptOnnwT2U+H50WilTbPekCDoATx+qxzy110xCmpYP6rV2RU7FbxnWTskQo4BBzmcYAgfqnjn04ytwo4mPPwj7pZp/n1U8mshpoOzXQbRlV2Kvk9MdK5rg5pIc0ghwwQQZBB4GVbqZ1PmtRpIXM6KZhustiJtEB0PcWjiQLuegkA6c+KYKaj2krFbhLwXd4xOBoBoIGAOQCEU9TyTLETmIpAYhDFpDFZYT5IE9nOnp+aqCmnNYrazkgQG/ui7POkdOWdMpzWJjKasms24ztpJ5aSZM6AegAHwCexmPktFKkF255cuumdlJPOyyPzj1WunRhbOyBA/Pmuvx5uuvrhnZjx/OkoTR6LtupCCCOGPhPyWd1EafspkanblvpttAAN0m4zw4CIxz149EqswucXHU5MADPHAAA8F1+wbzH50Sn0B9lm8xuduP2Si6XYBRTy37IYxaGUwktRhy489R165o7UTo6JYzgK6jC0kGJBgwQR1yMHxC17Z8Ln00QBuVZCjVPS+DQBor7NVKawrc6YvNhTm6A8OHj+yQ5i1uCAN6KdVeYxPpqrFpcqc1c66xkLM5UtWrs+fJBasqqtVc8NDiIY21sACBJMY111KBrAnBihYmmEliJtMZn8yExrEwsViUgM/onMZhWGJ9Jkrpyx0BtNNpNhPZT9UxlH+q6Rw6qqbTK6Ox02nDnBuMTp+dViiFDVVt1z86fXdwnGPhP3PqsFd3JOrPho5mdDw5ERjPFc+o4rPrHTn8YHPKNj+aQ5E1+Fj39drx8PgKJFyivtn/wAyg1XCaAiDF5devCgE7Z2tubdJbIujWOIHVQNTWsiOv3+GhWpWeoHaAy51gIbPdByY6nmqrBs90ECBMmcxk6aSmdmqczJ4rWs4UAoEwNXH31vFrWvpty8iDyAdr5x8wmr5I27ernm2nNvMau+wXV2Sm5rGh2vHp0Xn91SHs/mEz46r1sJ61LzIzQP2VtCb2ZmAJPIKWqa1hRYqaxaYUFNVGWxGxg/VPgOODx8YT+zUfRgAyM8OI8VAgBE1qIMTAxWVLAhvh8An0mIAxaaTQNZXXmuXUMYzKKr4qAgJL35Vtc5ztC5Jc/gjJQuaY+I+/wAFm9NzgmqORR06Tnw0DOowJPnx04o9Mg5yCI4ERx5yfCELnCe6CBA18M/FYtdJGarTzlKDFte0QNZzPwjz1+CS5izW4SomWKKaYu1XanBisMXN1KDU1oIGmDzGsciiDETY4zpjPFWM2FwoG850Onw+KZCkK6mMO8drbTtjNxjOOGcA815jeO7KrHFxBeHEm9oPHJuH6T8F0vad/fYOk+pj6Lobl3k17Qxxh4wJ/V4deim6uZNeTZWtgiJnHlxXpd1b7bUIY8WvOBHuu+x6IN+7hvBqU5v1LODhH6eR6LyokHkQeoII+RW4zfr6MBBxjqhtXm91+0TmgNqgvH+Ie8PH/F8/Fem2WuyoLmODhxjUdCNR5pRGsRhqZCjQrKlgHNSnMWkhUWpSM4YjYxNtRNakKpjE9jyGloOCQSOcTHzSypK3OnO8pCU9qY4qNPMT08sFS1ZyQGonjrKe8NIEDI1M65xA4YS7EXCixBan2KWqLCHjAEDE54mUu1aXNQQs2tSE2+CiZaopq4YGK7EYartXPXTC7VVqeGqi1NMKA6SrhNLdM+PRSFdTHnPaim21h/VJjwAz8SPivOtJaZEL22992GuwNDwwtMzE4IgiJHT0WHZ/ZWmBD3vdyiGx5ZUWOC/f9drhD8CMODTPiYn4pe8N4U64ucwsqgZeyC1/K5pyPGSR1XY272RDoNOpBAiHiZz/AIm6eh4Lz21bl2inN1J8A+83vjx7skDxhanTFjFcQn7NtTmODmOLXDiPzI6LLfw+fBQFX0Y9zuHfvau7N4AfBgjR0DlwPHyOi77hiTovnW4XRtFLMd8D1x9Y819Gr0Q9pa6QDyMFNMI2eu18xwMH88k+1czcz+89jvfbgni4DAJHPryhdYBSdNdcyX4XasjN4sNQUhJJ/UPdB1iV0AFy97uFO2pE94COIxq1x93Ayrqc8y3K6TmqiwxPNL2TahUYHgWzIiZ0MJ7nmAJwNBynVX0l5y4XarLIAPA/RWVUKaeVBWrhUr6TFEICmBCQl6JyW4ZVEI4VQs61gbVauFE0w61QNRwiaFzbLhVanPMmYjwVWoFwqtTbVVqGAAVwiDVdqumAhEG+s6K7VcJqYU+i13vNafEA/NfPfax7TtLg0ABjWtwABMXHT+aPJfRiF8k2raC973n9bnO/3En6q6Ydu50Vaf8AmM/5BfUiF8p2V8PYeTmn0IK+sgKWrjxu+t6PpbU4MAbDWAmAS4FoM5nGbf8ASvXMcHNDhoQCPMLxPtgY2kf5bP8Am/C9F7LbTfRtJksPoDkePFR0vO866wC817T7QS9rGn3WyeUuJAnyHxXp3wAScACSegXzratt7So55GHOkDN0CQ0R4AK6n4+fuvU+zW13se20tscM8y4T/XzXYhYfZ2zsAWibi6SZBkOjPWAAujarrPU/1QQpCZaqtTWcBCkI4VQmmALVC1MDZTKlOBk50jw+iIzEKoRkKrVGlQorhRUxohXCK1XastAhSEcKQgCFIRQpCAYUhFCooKQkqygIQZN7bTZQqP4tY6PEiG/EhfKQvontiD/ZXxpdTnwvH1hfOkTGnY6dzh0Iz1Oi+mbDvFj2iSGHAtcWgkwPdEyRmPIr5rsVaydc8jBXUdVLg2dWnEiIkHHmpa9HH451y0e2f/sj/LZH+5/1laPY/af722dQREa4nXxC5Ffag5ze1Y51osBDiCGgnGddSh2Csym+9r4gy26Q4Z42yDhTVnGTy9p7Wbw7OgWj3qndHh+o+mP9S8W1w8Tz4jWdcaFa9/bca77oNoaABpGsnzM/Bc9p5x+0Jq88+ZlfStieBRY490CmCegDZJx6q9k2xlQS2dTg4McxzBWHYtsazZRgm5sWnIBiCJ4CF5jY95sY4OyHtORmHDM6dM55+s9fXLrjLXvlSClUDgHDQgH1Vyta5YJSEMqKmLCoqpUlNMSFCFFUppiKKlE0xshXCMKQighSESsIFwpCNCVAKByNCUUMKEKyFRKGFVKbXNLXNDmkEEESCDggheC377Lvpkvogvp62jL2dI1c3rrz5r35XJ39vF1FgLIucYbPDGXfnNDHzrZaerjwMRxJ1Ppj1C0MJJdiTOJ/ZdTeey2tpgyXPaHvM5JfnJ8SfRc11QDutEu06DxKz1+3o/HP8zTnNBm4ATwJ18tUFRjBqAMcc+nVZnVyNDJ0JM46BJjmo3ep/wAanVAdCdPXyQsOdQPzX5IBUnj9FRBRLXbpb5fTpWiMkxIGOvywkbr3O/aHglpFP9T/AA1DeZPPQL0u4t3WMBqMaX6tkSWAgYk6GZXVuVnLj31tw2k0NaGtEACAOgR3JAepctORxeq7RJL0NyDRehvSblYKob2il6TKoFQPvUSblFR1rlLku5DepgdcpKSXqXqhsoHlDegeVAcqi5I7RTtFVML0Jeluell6gc568VvTfLKtQXtd2TJtDYl5nLnZGOQwfVevuXI2vcFF5loLCdbIg/6TgeSNTP68lt22F7i66BgAaQ1otaI8AsTncBgfEr6LR3dSY21rG+JAJPUk6q6my03CHMYR1a37KeWvb5tK2U921nQRSfH8hHxK9nT3RQY+9tMBw01IB5hpMAreXJ5S9vGbN7PV3e80MH8RBPo2fovQ7u3NTow73nj9Z66w3QfNdBz0BcrOWb3aaXqXpJcgc9XGdablLllD0V6mB9ylyzdop2iYNQeFdyxF6Y2omGtMqpSg5FKKKVEEqIOh2irtEuVJWmDO0Vh6TKiBwqKPekyoSmLq5VEqlRRUJVFQoZQXKolCShlQEXIZQkqiVQRKElCXKi5ARcgLkJcgJQGXIZQyoVRZcpcgKigKVCULlEFyraUBVygNr0baiU1WFMGi7qos8qJg6sqpUUK0yuVUqSqlBcqShlSUaFKkoVUqAigJUJQEoIShlUSrZTJiIyY8Op6fZAJKElE1kkCdY4HR0R/yB81RZmJ1wBBnQEyBpEj14oAJVIxTMAnAIJzOIE58kLaZJjMkEwBJwSIjicKhZKpEWCJuETEiTxIEc/dJlVUZEZnSMEDInBOuvxQCUMqEqiUFyrhAoFAblUKNKiCEKiiQoLBRtKABWEDJUQSFFUdUhUmkJdquJqigRkISpgolS5CSlF6Lp1yhckl6q9RDS5ASh7RCXqtCJQ3kRnTTTmDnnkDXkgc9AXoGB5EQdI4DhkcMgQMaYCEPI0OkRgcNNQl3KrkDLzmDrrhvItHDkYVF558I4acsoLkJcgaajufwbzJ0jOpQueTr04NGggSQJOEFyqUBQpCq5XKgkKirlVKCQiCGVZKC5VhACruVBhU5DcpKgLKiGVE0dsoAootucRyBypRFAUp6iilC1TVaiirelqKKrFFA789FFFFAVSiiCgooooIoooqIrUUUSIooohUaoeCiiKhUKiiotytRRQi1FFFB/9k=',
    }
],[
    {
        title : "YeYee - Busted 5",
        cover : 'https://64.media.tumblr.com/ab09dde560b93176efa9074a55c827e9/tumblr_ofeh3hlxzB1qloxj6o1_1280.jpg'
    },
    {
        title : "Mila - Hello 6",
        cover : 'https://indiater.com/wp-content/uploads/2021/06/Free-Music-Album-Cover-Art-Banner-Photoshop-Template-990x990.jpg',
    },{
        title : "YeYee - Busted 7",
        cover : 'https://cdna.artstation.com/p/assets/images/images/037/010/920/large/kimmo-hautalahti-free-heart-great-again-300dpi.jpg?1619217203'
    },
    {
        title : 'Mila - Hello 8',
        cover : 'https://wallpaper.dog/large/20458355.jpg',
    }
],[
    {
        title : "YeYee - Busted 9",
        cover : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6H3I0WHf2AEqJh4XGvywVhpsIRY4pdeXjGQ&usqp=CAU'
    },
    {
        title : 'Mila - Hello 10',
        cover : 'https://www.designformusic.com/wp-content/uploads/2019/08/grind-3D-production-music-album-cover-design-1000x1000.jpg',
    }
]
]



const RecentlyPlayed = () => {
    return <div style={{maxHeight: '50vh', textAlign : 'left', marginLeft: 20}}>
        <h3 className="recently_played_label">Recently Played</h3>
        <CarouselProvider
            naturalSlideWidth={100}
            naturalSlideHeight={30}
            totalSlides={mock_data.length}
        >
            <div style={{display: 'grid', gridTemplateColumns: '1fr 10fr 1fr', marginRight : 10}}>
                <ButtonBack className="button_back" style={{borderTopLeftRadius: 10, borderBottomLeftRadius: 10, border: 'none'}}><ArrowLeft/></ButtonBack>
                <Slider style={{marginLeft:0}}>
                    {mock_data.map((group,i)=><Slide style={{textAlign: 'left'}} key={i} index={i}>
                        <div key={i} style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', height: '100%'}}>
                            {group.map((item,ix)=><div className="music_item" key={ix}>
                                <img key={ix + "_img"} src={item.cover} style={{width: '100%', height: '100%'}}/>
                            </div>)}
                        </div>
                    </Slide>)}
                </Slider>
                <ButtonNext className="button_next" style={{borderTopRightRadius: 10, borderBottomRightRadius: 10, border: 'none'}}><ArrowRight/></ButtonNext>
            </div>
        </CarouselProvider>
    </div>
}

export default RecentlyPlayed