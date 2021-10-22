function showHelp() {
    Swal.fire({
        title: 'Help',
        icon: 'info',
        html:
          'Click anywhere on the screen to place a node. Select two nodes, one after each other, to create a link.',
        showCloseButton: true,
        focusConfirm: true,
        confirmButtonText:
          '<i class="fa fa-thumbs-up"></i> Great!',
        confirmButtonAriaLabel: 'Thumbs up, great!',
    })
}