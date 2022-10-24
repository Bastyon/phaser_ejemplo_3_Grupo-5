import Phaser from 'phaser';

class Escena extends Phaser.Scene {

    // Se usará como palabra clave para usar la escena
    constructor() {
        super({ key: 'game' });
    }

    cursors = null;
    paleta = null;
    pelota = null;
    ladrillosCero = null;
    ladrillosUno = null;
    ladrillosDos = null;
    ladrillosTres = null;
    ladrillosCuatro = null;
    ladrillosCinco = null;

    // Esta funcion se va a ejecutar cuando la escena se cargue por primera vez y cada vez que se refresque la escena
    init() {
        this.score = 0;
    }

    // Contiene las precargas de los archivos necesarios para la escena actual
    preload() {

        // Carga una imagen. Los parametros son el nombre y la direccion
        this.load.image('fondo', 'img/fondo.png');
        this.load.image('pelota', 'img/ball.png');
        this.load.image('ladrillo0', 'img/brick0.png');
        this.load.image('ladrillo1', 'img/brick1.png');
        this.load.image('ladrillo2', 'img/brick2.png');
        this.load.image('ladrillo3', 'img/brick3.png');
        this.load.image('ladrillo4', 'img/brick4.png');
        this.load.image('ladrillo5', 'img/brick5.png');
        this.load.image('paleta', 'img/paddle.png');

    }

    // Contiene el código para ejecutar una escena
    create() {

        // Mundo
        this.physics.world.setBoundsCollision(true, true, true, false); // hace que los bordes gestionen colisiones

        // Fondo
        this.add.image(400, 300, 'fondo');

        // Score
        this.scoreText = this.add.text(10, 570, 'Puntos: 0', {
            fontSize: '20px',
            fill: '#ff0',
            fontFamily: 'verdana, arial, sans-sarif'
        });

        // Paleta
        this.paleta = this.physics.add.image(400, 500, 'paleta');
        this.paleta.setBounce(1);
        this.paleta.setCollideWorldBounds(true);
        this.paleta.body.allowGravity = false;
        this.paleta.body.immovable = true; // hace a la paleta inamovible para otros elementos

        // Pelota
        this.pelota = this.physics.add.image(400, 485, 'pelota');
        this.pelota.setCollideWorldBounds(true); // hace que colisione con los bordes
        this.pelota.setBounce(1); // hace que la pelota rebote
        this.pelota.setData('glue', true);

        // Teclado
        this.cursors = this.input.keyboard.createCursorKeys();

        // Ladrillos
        this.ladrillos = this.physics.add.staticGroup({
            key: ['ladrillo0', 'ladrillo1', 'ladrillo2', 'ladrillo3', 'ladrillo4', 'ladrillo5'],
            frameQuantity: 10, // cantidad de ladrillos
            gridAlign: {
                width: 10, // ancho de la malla
                height: 6, // alto de la malla
                cellWidth: 70, // ancho en px de la malla
                cellHeight: 40, // alto en px de la malla
                x: 100, // posicion en x de la malla
                y: 100 // posicion en y de la malla
            }
        });

        // Colisiones
        this.physics.add.collider(this.pelota, this.paleta, this.platformImpact.bind(this), null);
        this.physics.add.collider(this.pelota, this.ladrillos, this.ladrillosImpact, null, this);
    }

    // Se ejectura constantemente. El código escrito estará pendiente a las acciones
    update() {

        // Mueve la paleta
        if (this.cursors.left.isDown) {
            this.paleta.setVelocityX(-300);
            if (this.pelota.getData('glue')) {
                this.pelota.setVelocityX(-300);
            }
        }
        else if (this.cursors.right.isDown) {
            this.paleta.setVelocityX(300);
            if (this.pelota.getData('glue')) {
                this.pelota.setVelocityX(300);
            }
        }
        else {
            this.paleta.setVelocityX(0);
            if (this.pelota.getData('glue')) {
                this.pelota.setVelocityX(0);
            }
        }

        // Comprueba la posicion de la pelota
        if (this.pelota.y > 600) {
            console.log('Ball cayo al vacio');
            this.showGameOver();
        }

        if (this.cursors.up.isDown) {
            this.pelota.setVelocity(300, 450);
            this.pelota.setData('glue', false);
        }
    }

    // Impacto del jugador con la pelota y más
    platformImpact(pelota, paleta) {
        let relativeImpact = pelota.x - paleta.x;
        if (relativeImpact < 0.1 && relativeImpact > -0.1) {
            pelota.setVelocityX(Phaser.Math.Between(-10, 10))
        } else {
            pelota.setVelocityX(10 * relativeImpact);
        }
    }

    // Impacto de la pelota con los ladrillos
    ladrillosImpact(pelota, ladrillo) {
        ladrillo.disableBody(true, true);
        this.score++;
        this.scoreText.setText('Puntos: ' + this.score);
        if (this.ladrillos.countActive() === 0) {
            this.showCongratulations();
        }
    }

    // Escena de Game Over
    showGameOver() {
        this.scene.start('gameover');
    }

    // Escena de Game Over
    showCongratulations() {
        this.scene.start('congratulations');
    }

}

export default Escena;