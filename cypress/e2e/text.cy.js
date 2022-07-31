
describe('Text Tag Tests', function () {

    beforeEach(() => {
    //   cy.clearIndexedDB();
      cy.visit('localhost:3000/src/cypressTest/index.html')
    })
  

    it('spaces preserved between tags', () => {
      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <document><p><text>Hello</text> <text>there</text>!</p>
  
      <p><text>We <text>could</text> be <text copyTarget="/_text2" />.</text></p></document>
      `}, "*");
      });
  
      cy.get('p#\\/_p1').invoke('text').should('contain', 'Hello there!')
      cy.get('p#\\/_p2').invoke('text').should('contain', 'We could be there.')
  
    })
  
  })
  
  
  
  