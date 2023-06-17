import styles from './Footer.module.css'

export const FooterComponent = () => {
    return (
        <footer className={styles.footer}>
            <p>© <span>{new Date().getFullYear()}</span> Copyright <span>|</span> Made by <span>Emil Stoychev</span></p>

            <div className={styles.socialMedia}>
                <span>|</span>
                <i onClick={() => window.open('https://www.facebook.com/profile.php?id=100010478416709', '_blank')} className="fa-brands fa-facebook"></i>
                <i onClick={() => window.open('https://www.instagram.com/emil.stoichev/', '_blank')} className="fa-brands fa-square-instagram"></i>
                <i onClick={() => window.open('https://github.com/Emil-Stoychev', '_blank')} className="fa-brands fa-github"></i>
                <i onClick={() => window.open('https://www.linkedin.com/', '_blank')} className="fa-brands fa-linkedin"></i>
                <span>|</span>
            </div>
        </footer >
    )
}