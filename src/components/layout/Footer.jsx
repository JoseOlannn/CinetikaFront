import '../../styles/Footer.css';

import facebook from "../../assets/redes/facebook.jpg";
import instagram from "../../assets/redes/instagram.jpg";
import ex from "../../assets/redes/ex.PNG";


function Footer() {
    return(

         <footer className="footer">

             <div className="footer-diseno">

                <div className="diseno-accion">
                    <h2>¿Te gustaría empezar a disfrutar de las mejores películas retro?
                        Suscríbete a Cinetika y siente la nostalgia.
                    </h2>
                    <button className="btn-comenzar">Comenzar</button>
                </div>

                <div className="diseno-links">
                    <div className="diseno-link">
                        <h4>Nosotros</h4>
                        <h4>Únete a la comunidad</h4>
                        <h4>Famdom Cinetika</h4>
                    </div>
                    <div className='diseno-link'>
                        <h4>Atención al cliente</h4>
                        <h4>Contáctanos</h4>
                        <h4>Formas de pago</h4>  
                    </div>
                </div>

                <div className="redes">
                   <img src={instagram} alt="Instagram" /> 
                   <img src={facebook} alt="Facebook" />
                   <img src={ex} alt="X" />
                </div>

                <p className="redes copyright">
                 Cinetika. Copyright 2026. Reservados todos los derechos.
                 </p>

            </div>   
        </footer>


            
    )
}

export default Footer;