//  Ray Casting - Program 1
//  
//  CSC-561
//  Principles of Computer Graphics
//
//  Created by Sujal 
//  Student id: 200252102
//
// Color constructor
class Color {
    constructor(r,g,b,a) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || (typeof(b) !== "number") || (typeof(a) !== "number"))
                throw "color component not a number";
            else if ((r<0) || (g<0) || (b<0) || (a<0)) 
                throw "color component less than 0";
            else if ((r>255) || (g>255) || (b>255) || (a>255)) 
                throw "color component bigger than 255";
            else {
                this.r = r; this.g = g; this.b = b; this.a = a; 
            }
        } // end try
        
        catch (e) {
            console.log(e);
        }
    } // end Color constructor

        // Color change method
    change(r,g,b,a) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || (typeof(b) !== "number") || (typeof(a) !== "number"))
                throw "color component not a number";
            else if ((r<0) || (g<0) || (b<0) || (a<0)) 
                throw "color component less than 0";
            else if ((r>255) || (g>255) || (b>255) || (a>255)) 
                throw "color component bigger than 255";
            else {
                this.r = r; this.g = g; this.b = b; this.a = a; 
            }
        } // end throw
        
        catch (e) {
            console.log(e);
        }
    } // end Color change method
} // end color class


/* utility functions */

// draw a pixel at x,y using color
function drawPixel(imagedata,x,y,color) {
    try {
        if ((typeof(x) !== "number") || (typeof(y) !== "number"))
            throw "drawpixel location not a number";
        else if ((x<0) || (y<0) || (x>=imagedata.width) || (y>=imagedata.height))
        {    throw "drawpixel location outside of image";
            console.log("X : Y = " +x +","+y);

        }
        else if (color instanceof Color) {
            var pixelindex = (y*imagedata.width + x) * 4;
            imagedata.data[pixelindex] = color.r;
            imagedata.data[pixelindex+1] = color.g;
            imagedata.data[pixelindex+2] = color.b;
            imagedata.data[pixelindex+3] = color.a;
        } else 
            throw "drawpixel color is not a Color";
    } // end try
    
    catch(e) {
        console.log(e);
    }
} // end drawPixel
    

//get the input triangles from the standard class URL
function getInputTriangles() {
    const INPUT_TRIANGLES_URL = "https://ncsucgclass.github.io/prog1/triangles.json"
 
    // load the triangles file
    var httpReq = new XMLHttpRequest(); // a new http request
    httpReq.open("GET",INPUT_TRIANGLES_URL,false); // init the request
    httpReq.send(null); // send the request
    var startTime = Date.now();
    while ((httpReq.status !== 200) && (httpReq.readyState !== XMLHttpRequest.DONE)) {
        if ((Date.now()-startTime) > 3000)
            break;
    } // until its loaded or we time out after three seconds
    if ((httpReq.status !== 200) || (httpReq.readyState !== XMLHttpRequest.DONE)) {
        console.log*("Unable to open input triangles file!");
        return String.null;
    } else
        return JSON.parse(httpReq.response); 
} // end get input triangles

// ----------------------------------****************----------------------------------------

//  Functions
//
//  Reading the JSON file for triangles
function GetInput()
{
    var inputTriangles = getInputTriangles();

    if(inputTriangles != String.null)
    {
        var f = inputTriangles.length;

        //for each file
        for (var i=0; i<f; i++)
        {
            var n = inputTriangles[i].triangles.length;
            //for each triangle
            for(var j=0; j<n; j++)
            {
                //taking each vertex index 
                var v1= inputTriangles[i].triangles[j][0];
                var v2= inputTriangles[i].triangles[j][1];
                var v3= inputTriangles[i].triangles[j][2];

                //complete set of a vertex with (x,y,z) coordinates
                var vertex_Pos1 = inputTriangles[i].vertices[v1];
                var vertex_Pos2 = inputTriangles[i].vertices[v2];
                var vertex_Pos3 = inputTriangles[i].vertices[v3];

                //Shading Quoficients

                var am = inputTriangles[i].material.ambient;
                var di = inputTriangles[i].material.diffuse;
                var sp = inputTriangles[i].material.specular;
                var exp = inputTriangles[i].material.n;

                
                //initialise objects with these vertices

                //tri= single object of class Triangle
                var tri = new Triangle(vertex_Pos1,vertex_Pos2,vertex_Pos3,am,di,sp,exp);

                //pushing latest obj in arraylist = tris
                tris.push(tri);

                //accessing latest object
                //console.log("triangles" + tris[tris.length-1].a);
                
            }
        }
    }
} 

//  Calculating the determinant function

//  Reference: used the function code from www.coderbyte.com

function det(M) {
   if (M.length==2) { return (M[0][0]*M[1][1])-(M[0][1]*M[1][0]); }
   return M[0][0]*det(deleteRowAndColumn(M,0)) - 
          M[0][1]*det(deleteRowAndColumn(M,1)) +
          M[0][2]*det(deleteRowAndColumn(M,2));
}

function deleteRowAndColumn(M,index) {
   var temp = [];
   // copy the array first
   for (var i=0; i<M.length; i++) { temp.push(M[i].slice(0)); } 
   // delete the first row
   temp.splice(0,1); 
   // delete the column at the index specified
   for (var i=0; i<temp.length; i++) { temp[i].splice(index,1); } 
   return temp;
}

// Finding intersection for each triangle using Barycentric calculations

function find_t(eye,dist)
{
    //for each triangle
    for(var i=0; i<tris.length; i++)
    {   
        //Matrix A
        var A = [[tris[i].a[0] - tris[i].b[0], tris[i].a[0] - tris[i].c[0], dist[0]],
                [tris[i].a[1] - tris[i].b[1], tris[i].a[1] - tris[i].c[1], dist[1]],
                [tris[i].a[2] - tris[i].b[2], tris[i].a[2] - tris[i].c[2],dist[2]]];

        //calculating det of A
        var resultA = det(A);

        //condition
        if(resultA == 0)
        {
                int_t[i]=0;
                return ;
        }    

        //Matrix beta
        var beta = [[tris[i].a[0] - eye[0], tris[i].a[0] - tris[i].c[0], dist[0]],
                    [tris[i].a[1] - eye[1], tris[i].a[1] - tris[i].c[1], dist[1]],
                    [tris[i].a[2] - eye[2], tris[i].a[2] - tris[i].c[2], dist[2]]];

        //calculating det of beta
        var resultbeta = det(beta)/resultA;
        
        //Matrix gamma
        var gamma = [[tris[i].a[0] - tris[i].b[0], tris[i].a[0] - eye[0], dist[0]],
                     [tris[i].a[1] - tris[i].b[1], tris[i].a[1] - eye[1], dist[1]],
                     [tris[i].a[2] - tris[i].b[2], tris[i].a[2] - eye[2], dist[2]]];

        //calculating det of gamma
        var resultgamma = det(gamma)/resultA;

        //Matrix t_int
        var t_int = [[tris[i].a[0] - tris[i].b[0], tris[i].a[0] - tris[i].c[0], tris[i].a[0] - eye[0]],
                       [tris[i].a[1] - tris[i].b[1], tris[i].a[1] - tris[i].c[1], tris[i].a[1] - eye[1]],
                       [tris[i].a[2] - tris[i].b[2], tris[i].a[2] - tris[i].c[2], tris[i].a[2] - eye[2]]];      
        
        //calculating det of t_inter            
        var resultt_int = det(t_int)/resultA;

        //Intersecting conditions
        
        //for each intersection, store 't' for that triangle, else store '0' 

        if((resultbeta>=0) && (resultgamma>=0) && ((resultbeta + resultgamma)<=1))
        {
            int_t[i] = resultt_int;
        }
        else
        {
            int_t[i] = 0;
        }

    }
    
}

//Calculating normal vector of triangle

function normal_vector(n,v)
{
    var U = new Vector(tris[n].b[0] - tris[n].a[0], tris[n].b[1] - tris[n].a[1], tris[n].b[2] - tris[n].a[2]);
    var V = new Vector(tris[n].a[0] - tris[n].c[0], tris[n].a[1] - tris[n].c[1], tris[n].a[2] - tris[n].c[2]);

    var N = Vector.cross(U,V);

    //checking direction
    if((Vector.dot(N,v))<0)
        {
            var temp_zero = new Vector(0,0,0);
            N = Vector.subtract(temp_zero,N);
        }
     
    return Vector.normalize(N);
}

//-----------------------------------***************----------------------------
//classes

// Vector class
// Thanks to Prof. Watson's code in exercise4

class Vector { 
    constructor(x,y,z) {
        this.set(x,y,z);
    } // end constructor
    
    // sets the components of a vector
    set(x,y,z) {
        try {
            if ((typeof(x) !== "number") || (typeof(y) !== "number") || (typeof(z) !== "number"))
                throw "vector component not a number";
            else
                this.x = x; this.y = y; this.z = z; 
        } // end try
        
        catch(e) {
            console.log(e);
        }
    } // end vector set
    
    // copy the passed vector into this one
    copy(v) {
        try {
            if (!(v instanceof Vector))
                throw "Vector.copy: non-vector parameter";
            else
                this.x = v.x; this.y = v.y; this.z = v.z;
        } // end try
        
        catch(e) {
            console.log(e);
        }
    }
    
    toConsole(prefix="") {
        console.log(prefix+"["+this.x+","+this.y+","+this.z+"]");
    } // end to console
    
    // static dot method
    static dot(v1,v2) {
        try {
            if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
                throw "Vector.dot: non-vector parameter";
            else
                return(v1.x*v2.x + v1.y*v2.y + v1.z*v2.z);
        } // end try
        
        catch(e) {
            console.log(e);
            return(NaN);
        }
    } // end dot static method
    
    // static cross method
    static cross(v1,v2) {
        try {
            if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
                throw "Vector.cross: non-vector parameter";
            else {
                var crossX = v1.y*v2.z - v1.z*v2.y;
                var crossY = v1.z*v2.x - v1.x*v2.z;
                var crossZ = v1.x*v2.y - v1.y*v2.x;
                return(new Vector(crossX,crossY,crossZ));
            } // endif vector params
        } // end try
        
        catch(e) {
            console.log(e);
            return(NaN);
        }
    } // end dot static method
    
    // static add method
    static add(v1,v2) {
        try {
            if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
                throw "Vector.add: non-vector parameter";
            else
                return(new Vector(v1.x+v2.x,v1.y+v2.y,v1.z+v2.z));
        } // end try
        
        catch(e) {
            console.log(e);
            return(new Vector(NaN,NaN,NaN));
        }
    } // end add static method

    // static subtract method, v1-v2
    static subtract(v1,v2) {
        try {
            if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
                throw "Vector.subtract: non-vector parameter";
            else {
                var v = new Vector(v1.x-v2.x,v1.y-v2.y,v1.z-v2.z);
                return(v);
            }
        } // end try
        
        catch(e) {
            console.log(e);
            return(new Vector(NaN,NaN,NaN));
        }
    } // end subtract static method

    // static scale method
    static scale(c,v) {
        try {
            if (!(typeof(c) === "number") || !(v instanceof Vector))
                throw "Vector.scale: malformed parameter";
            else
                return(new Vector(c*v.x,c*v.y,c*v.z));
        } // end try
        
        catch(e) {
            console.log(e);
            return(new Vector(NaN,NaN,NaN));
        }
    } // end scale static method
    
    // static normalize method
    static normalize(v) {
        try {
            if (!(v instanceof Vector))
                throw "Vector.normalize: parameter not a vector";
            else {
                var lenDenom = 1/Math.sqrt(Vector.dot(v,v));
                return(Vector.scale(lenDenom,v));
            }
        } // end try
        
        catch(e) {
            console.log(e);
            return(new Vector(NaN,NaN,NaN));
        }
    } // end scale static method
    
} // end Vector class

// Triangle class

class Triangle {
    constructor(a, b, c, am, di, sp, exp) {
        //super();
        this.a = a;
        this.b = b;
        this.c = c;
        this.am = am;
        this.di = di;
        this.sp = sp;
        this.exp = exp;
    }


}
//tris = array list of multiple objects of class Triangle
var tris = [];

//int_t = array of all the intersecting 't' of each traingle
var int_t = [];

//Global variables
var Objects = [];
var eye = new Array(0.5,0.5,-0.5);
var dist = new Array(0,0,0);
var z = 0; // z coordinate of viewport

// Ray Casting Algorithm

function rayCast(context)
{
    var w = context.canvas.width;
    var h = context.canvas.height;
    var c = new Color(255,0,0,255);
    var c1 = new Color(0,0,0,255);
    var imagedata = context.createImageData(w,h);

    //Reading input JSON
    GetInput();

    //looping for each pixel in viewport
    for(var i=0; i<w; i++)
    {
        x=i/w;

        for(var j=h; j>0; j--) //changing to world coordinates
        {
            y= (h-j)/h;

            dist[0] = x - eye[0];
            dist[1] = y - eye[1];
            dist[2] = z - eye[2];
            
            //Now calculating the intersection of each triangle using Barycentric calculations
            find_t(eye, dist);

            var max_t = Math.max.apply(Math,int_t);

            var t_id = 0; //closest object
            var t=0; //value of t

            //for each triangle
            for(var o=0; o<tris.length; o++)
            {
                if(int_t[o]>=1 && int_t[o]<=max_t)
                {
                    t_id=o;
                    t=int_t[o];
                }
            }
                //if intersection exists!!
                if(t!=0)
                {
                    
                    //Shading:
                    
                    //light source (-3,1,-0.5) 
                    var light_source = new Vector(-3,1,-0.5);

                    //eye
                    var eye_source = new Vector(eye[0],eye[1],eye[2]);

                    //scaling t times 
                    var d = Vector.scale(t,new Vector(dist[0],dist[1],dist[2])); 
                    
                    //P vector: plane of triangle = (e+td)
                    var P = Vector.add(eye_source,d); 
                                        
                    //v vector : viewing vector
                    var v = Vector.normalize(Vector.subtract(eye_source,P));

                    //l vector = light_source - P ::: ligthing vector
                    var l = Vector.normalize(Vector.subtract(light_source,P));

                    //normal vector
                    var normal = normal_vector(t_id,v); 
 
                    //h vector : half vector
                    var h1 = Vector.normalize(Vector.add(l,v));

                     //Phong model equations
                    r = tris[t_id].am[0]*255 + 
                        tris[t_id].di[0]*255*Math.max(0,Vector.dot(normal,l)) + 
                        tris[t_id].sp[0]*255* Math.pow(Math.max(0,Vector.dot(h1,normal)),tris[t_id].exp);
                 
                    g = tris[t_id].am[1]*255 + 
                        tris[t_id].di[1]*255*Math.max(0,Vector.dot(normal,l)) + 
                        tris[t_id].sp[1]*255* Math.pow(Math.max(0,Vector.dot(h1,normal)),tris[t_id].exp);
                    

                    b = tris[t_id].am[2]*255 + 
                        tris[t_id].di[2]*255*Math.max(0,Vector.dot(normal,l)) + 
                        tris[t_id].sp[2]*255*Math.pow(Math.max(0,Vector.dot(h1,normal)),tris[t_id].exp);
 
                   c.change(r,g,b,255);     
            

                   drawPixel(imagedata,i,j,c);

                }
               else
                    drawPixel(imagedata,i,j,c1);

        }
    }
        context.putImageData(imagedata,0,0);

}

/* main -- here is where execution begins after window load */

function main() {

    // Get the canvas and context
    var canvas = document.getElementById("viewport"); 
    var context = canvas.getContext("2d");


    rayCast(context);

}