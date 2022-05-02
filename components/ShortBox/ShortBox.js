import { useState, useEffect } from 'react'
import useLocalStorage from '../../hooks/useLocalStorage'

import Loader from '../Loader/Loader'

import styles from '../../styles/Shortbox.module.css'
import { shortLink } from '../../utils/shortLink'

const MSGS = {
  INVALID_LINK: 'Please add a link.',
  COPIED: 'Copied!',
}

export default function ShortBox () {

  const [localStorage, setLocalStorage] = useLocalStorage('recentsURL', [])
  const [recentsUrls, setRecentsUrls] = useState([])
  const [urlToShort, setUrlToShort] = useState('')
  const [errorEmpty, setErrorEmpty] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleClick = () => {
    const regex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g
    const url = urlToShort.match(regex)

    if(url) {
      setErrorEmpty(false)
      setLoading(true)

      shortLink(urlToShort).then(res => {
        setLocalStorage([...localStorage, {
          urlToShort: urlToShort,  
          urlShort: res
        }])
        setUrlToShort('')
        setLoading(false)
      })

    }else {
      setErrorEmpty(true)
    }
  }

  const handleChange = (e) => {
    const { value } = e.target
    setUrlToShort(value)
    value === '' ? setErrorEmpty(true) : setErrorEmpty(false)
  }

  const handleClickCopy = (e, urlToCopy) => {
    e.target.textContent = MSGS.COPIED
    e.target.classList.add(styles.active)
    navigator.clipboard.writeText(urlToCopy)

    setTimeout(() => {
      e.target.textContent = 'Copy'
      e.target.classList.remove(styles.active)
    }, 2000)
    
  }

  useEffect(() => {

    //Se hace la asignación de la variable localStorage a la 
    // variable recentsUrls para que se renderice en el componente sino da error de hidratación

    setRecentsUrls(localStorage)
  }, [localStorage])

  return (
    <>
      <div className={styles.searchbox}>
        {
          loading &&
          <div className={styles.loader}>
            <Loader />
          </div>
        }
        <div className={styles.searchbox__input}>
          <input onChange={handleChange} className={errorEmpty ? styles.error : ''} type="text" autoComplete="off" value={urlToShort} />
          {errorEmpty && <span className={styles.search__input_message}>{MSGS.INVALID_LINK}</span>}
        </div>
        <button onClick={handleClick} className={styles.searchbox_button}>Shorten It!</button>
      </div>

      <ul className={styles.search__result}>
        {
          recentsUrls.map((url, index) => {
              return (
                    <li className={styles.search__result_item} key={url.urlShort + index}>
    
                      <div className={styles.search__result_item__pagelink}>
                        {url.urlToShort}
                      </div>
    
                      <div className={styles.search__result_item__shortenlink}>
                        {url.urlShort}
                      </div>
    
                      <button onClick={(e) => handleClickCopy(e, url.urlShort)} className={styles.search__result__button}>
                        Copy
                      </button>
    
                    </li>
              )
            }
          )
        }
      </ul>
    </>
  )
}